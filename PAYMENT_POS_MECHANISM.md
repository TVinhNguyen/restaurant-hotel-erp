# 🏪 Payment POS - Cơ Chế Vận Hành

## 📋 Tổng Quan

Payment POS là module thanh toán tích hợp **PayOS** gateway cho phép khách hàng/nhân viên thực hiện thanh toán trực tuyến qua các kênh thanh toán (thẻ, ví điện tử, chuyển khoản...) mà không cần xử lý dữ liệu thẻ trực tiếp.

---

## 🏗️ Kiến Trúc Tổng Thể

```
┌─────────────────┐
│   Frontend      │  (React/Next.js)
│   (Client)      │
└────────┬────────┘
         │ POST /payments-pos
         │ {orderId, amount, description}
         │
┌────────▼────────────────────┐
│   Backend API               │
│   (NestJS)                  │
│                             │
│  PaymentService            │
│  ├─ createPayment()        │
│  ├─ handleWebhook()        │
│  └─ getPaymentStatus()     │
│                             │
│  Redis Cache Manager       │
│  (Lưu trạng thái payment)  │
└────────┬────────┬──────────┘
         │        │
         │        │ Webhook từ PayOS
         │        │ (Khi thanh toán hoàn tất)
         │        │
         ▼        ▼
    ┌──────────────────────┐
    │    PayOS Gateway     │
    │  (Payment Provider)  │
    └──────────────────────┘
```

---

## 🔄 Quy Trình Thanh Toán Chi Tiết

### **Bước 1: Tạo Payment Request**

#### Frontend gửi yêu cầu:
```typescript
// Frontend: POST /payments-pos
const response = await fetch('/payments-pos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: '1702819200000',      // Unique order ID (string or number)
    amount: 100000,                 // Số tiền (VNĐ)
    description: 'Thanh toán đơn hàng #123' // Mô tả (max 25 ký tự)
  })
});
```

#### Backend xử lý (`payment.service.ts`):
```typescript
async createPayment(body: CreatePaymentDto): Promise<any> {
  // 1️⃣ Chuẩn bị dữ liệu
  const orderCode = body.orderId;
  const amount = body.amount;
  const description = body.description.slice(0, 25); // Tối đa 25 ký tự

  // 2️⃣ Xác định URL return
  const webUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const cancelUrl = `${webUrl}/payment/cancel?orderId=${orderCode}`;
  const returnUrl = `${webUrl}/payment/return?orderId=${orderCode}`;

  // 3️⃣ Tạo chữ ký (Signature) - Bảo mật
  const signatureData = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
  const signature = createHmac('sha256', PAYOS_CHECKSUM_KEY)
    .update(signatureData)
    .digest('hex');

  // 4️⃣ Gửi request tới PayOS API
  const payload = {
    orderCode,      // ID duy nhất cho đơn hàng
    amount,         // Số tiền
    description,    // Mô tả
    cancelUrl,      // URL khi hủy
    returnUrl,      // URL khi thành công
    signature       // Chữ ký bảo mật
  };

  const response = await axios.post(
    'https://api-merchant.payos.vn/v2/payment-requests',
    payload,
    {
      headers: {
        'x-client-id': PAYOS_CLIENT_ID,
        'x-api-key': PAYOS_API_KEY
      }
    }
  );

  // 5️⃣ Lưu trạng thái payment vào Redis Cache
  const paymentKey = `payment:${response.data.data.orderCode}`;
  const paymentData = {
    orderId: response.data.data.orderCode,
    originalOrderId: orderCode,
    status: 'pending',      // Chờ thanh toán
    amount: amount,
    description: description,
    createdAt: new Date().toISOString(),
    payosData: response.data
  };

  await cacheManager.set(paymentKey, paymentData, 1800 * 1000); // TTL: 30 phút

  // 6️⃣ Trả về checkout URL
  return {
    ...response.data,
    orderId: response.data.data.orderCode,
    checkoutUrl: response.data.data.checkoutUrl  // Redirect user tới đây
  };
}
```

#### Frontend nhận response:
```javascript
// Frontend nhận được PayOS URL
const { checkoutUrl } = await response.json();

// Chuyển hướng user tới PayOS gateway
window.location.href = checkoutUrl;
```

---

### **Bước 2: PayOS Payment Gateway**

- User điền thông tin thanh toán trên PayOS
- PayOS xử lý giao dịch với ngân hàng/ví điện tử
- Khi hoàn tất, PayOS sẽ:
  1. **Redirect** user về `returnUrl` (Frontend)
  2. **Gửi Webhook** tới Backend để thông báo kết quả

---

### **Bước 3: Webhook từ PayOS (Server-to-Server)**

#### PayOS gửi webhook:
```json
POST /payments-pos/webhook
{
  "code": "00",           // "00" = thành công, "CANCELLED" = hủy
  "desc": "success",
  "success": true,
  "data": {
    "accountNumber": "0987654321",
    "amount": 100000,
    "description": "Thanh toán đơn hàng",
    "reference": "ABC123DEF456",
    "transactionDateTime": "2024-12-20T10:30:00.000Z",
    "virtualAccountNumber": "12345678901",
    "orderCode": 1702819200000,    // ⚠️ QUAN TRỌNG
    "paymentLinkId": "link123",
    "currency": "VND"
  },
  "signature": "abc123def456..."   // Chữ ký xác minh từ PayOS
}
```

#### Backend xác minh & xử lý (`PaymentWebhookGuard`):
```typescript
// 1️⃣ Guard xác minh chữ ký (HMAC-SHA256)
canActivate(context: ExecutionContext): boolean {
  const req = context.switchToHttp().getRequest();
  const body = req.body;

  // Tính toán lại chữ ký từ dữ liệu
  const calculatedSignature = createHmac('sha256', PAYOS_CHECKSUM_KEY)
    .update(convertObjToQueryStr(sortObjDataByKey(body.data)))
    .digest('hex');

  // So sánh với chữ ký từ PayOS
  if (calculatedSignature !== body.signature) {
    throw new UnauthorizedException('Invalid payload');
  }

  return true;  // ✅ Xác minh thành công
}
```

#### Service xử lý webhook:
```typescript
async handleWebhook(body: any) {
  // 1️⃣ Lấy orderCode từ webhook
  const orderCode = body.data?.orderCode;
  const code = body.code;

  // 2️⃣ Lấy dữ liệu payment từ Redis
  const paymentKey = `payment:${orderCode}`;
  const existingPayment = await cacheManager.get(paymentKey);

  if (!existingPayment) {
    return { received: true, error: 'Payment not found' };
  }

  // 3️⃣ Xác định trạng thái
  let status = 'failed';
  if (code === '00' || code === 0) {
    status = 'success';      // ✅ Thanh toán thành công
  } else if (code === 'CANCELLED') {
    status = 'cancelled';    // ❌ User hủy
  }

  // 4️⃣ Cập nhật dữ liệu trong Redis
  const updatedPayment = {
    ...existingPayment,
    status,
    webhookData: body,
    completedAt: new Date().toISOString()
  };

  // Mở rộng TTL: success = 1 giờ, khác = 30 phút
  const ttl = status === 'success' ? 3600 * 1000 : 1800 * 1000;
  await cacheManager.set(paymentKey, updatedPayment, ttl);

  console.log(`Payment status updated: ${orderCode} -> ${status}`);
  return { received: true, status };
}
```

---

### **Bước 4: Frontend Kiểm Tra Trạng Thái**

Sau khi user được redirect về `returnUrl`, frontend sẽ polling API để kiểm tra trạng thái:

#### Frontend (Return Page):
```javascript
// pages/payment/return.tsx
const orderId = new URLSearchParams(location.search).get('orderId');

const checkPayment = async () => {
  const poll = setInterval(async () => {
    try {
      // 1️⃣ Gọi API check status
      const res = await fetch(`/payments-pos/status/${orderId}`);
      const data = await res.json();

      console.log('Payment status:', data);

      // 2️⃣ Kiểm tra kết quả
      if (data.found && data.status === 'success') {
        clearInterval(poll);
        alert('Thanh toán thành công! ✅');
        window.location.href = '/order-success';
      } else if (data.status === 'cancelled') {
        clearInterval(poll);
        alert('Thanh toán bị hủy');
        window.location.href = '/payment/cancel';
      } else if (data.status === 'failed') {
        clearInterval(poll);
        alert('Thanh toán thất bại');
        window.location.href = '/payment/failed';
      }
      // Nếu status = 'pending' → tiếp tục polling

    } catch (error) {
      console.error('Error checking status:', error);
    }
  }, 2000);  // Check mỗi 2 giây

  // Timeout sau 1 phút
  setTimeout(() => {
    clearInterval(poll);
    alert('Không thể xác nhận thanh toán. Vui lòng liên hệ support.');
  }, 60000);
};

useEffect(() => {
  checkPayment();
}, []);
```

#### Backend API (`getPaymentStatus`):
```typescript
@Get('status/:orderId')
async getPaymentStatus(@Param('orderId') orderId: string) {
  const paymentKey = `payment:${orderId}`;
  const payment = await cacheManager.get(paymentKey);

  if (!payment) {
    return { found: false, status: 'not_found' };
  }

  return { 
    found: true,
    status: payment.status,      // 'pending' | 'success' | 'cancelled' | 'failed'
    amount: payment.amount,
    orderId: payment.orderId,
    ...payment
  };
}
```

---

## 🛡️ Bảo Mật

### 1. **Signature Verification (HMAC-SHA256)**
```
Mục đích: Xác minh request/webhook đến thực sự từ PayOS

Quy trình:
1. PayOS + Backend cùng biết CHECKSUM_KEY (bí mật)
2. PayOS tính signature: HMAC-SHA256(data, CHECKSUM_KEY)
3. PayOS gửi signature trong webhook
4. Backend tính lại signature từ data
5. So sánh: nếu khớp = valid, không khớp = giả mạo

Công thức:
signature = HMAC-SHA256(
  "amount=100000&cancelUrl=...&description=...&orderCode=123&returnUrl=...",
  CHECKSUM_KEY
)
```

### 2. **API Key Authentication**
```typescript
// Mọi request tới PayOS API phải có headers:
headers: {
  'x-client-id': PAYOS_CLIENT_ID,    // Client ID
  'x-api-key': PAYOS_API_KEY         // Secret API Key
}
```

### 3. **Webhook Guard**
- Mọi webhook phải qua `PaymentWebhookGuard`
- Guard xác minh signature trước khi xử lý

---

## 📊 Trạng Thái Payment

```
┌─────────────────────────────────────────┐
│  Khách hàng tạo payment request         │
└────────────────┬────────────────────────┘
                 │
                 ▼
         ┌──────────────┐
         │   PENDING    │  (Chờ thanh toán)
         └──────┬───────┘
                │
        (PayOS webhook đến)
                │
                ├─── code: '00' ───────────┐
                │                          │
                │                          ▼
                │                   ┌──────────────┐
                │                   │   SUCCESS    │ ✅ Thanh toán thành công
                │                   │  (1 giờ TTL) │
                │                   └──────────────┘
                │
                ├─── code: 'CANCELLED' ──┐
                │                        │
                │                        ▼
                │                   ┌──────────────┐
                │                   │  CANCELLED   │ ❌ User hủy
                │                   │ (30 phút TTL)│
                │                   └──────────────┘
                │
                └─── Lỗi khác ──────────┐
                                       │
                                       ▼
                                  ┌──────────────┐
                                  │   FAILED     │ ❌ Thất bại
                                  │ (30 phút TTL)│
                                  └──────────────┘
```

---

## 🔧 Cấu Hình (Environment Variables)

```bash
# PayOS Configuration
PAYOS_CLIENT_ID=your_client_id
PAYOS_API_KEY=your_api_key
PAYOS_CHECKSUM_KEY=your_checksum_key

# Frontend Configuration
FRONTEND_URL=http://localhost:3000  # Hoặc production URL
```

---

## 📁 File Structure

```
backend/src/payment-pos/
├── payment.controller.ts          # Endpoints: POST /payments-pos, POST /webhook, GET /status/:orderId
├── payment.service.ts             # Logic: createPayment, handleWebhook, getPaymentStatus
├── payment.module.ts              # Module configuration
│
├── guards/
│   └── payment-webhook.guard.ts   # Xác minh chữ ký webhook
│
├── types/
│   └── dto.ts                     # CreatePaymentDto, Payment, PaymentStatus
│
├── dto/
│   ├── payos-request-payment.payload.ts      # Payload gửi tới PayOS
│   ├── payos-payment-created.response.ts     # Response từ PayOS khi tạo payment
│   └── payos-webhook-body.payload.ts         # Webhook payload từ PayOS
│
├── payos-utils.ts                 # Utility: generateSignature, sortObjDataByKey, convertObjToQueryStr
│
└── frontendcode.txt               # Ví dụ frontend code
```

---

## 🚀 Ví Dụ Sử Dụng End-to-End

### **1. Frontend - Tạo payment**
```typescript
// components/PaymentButton.tsx
import { paymentService } from '@/lib/services/payments';

export const PaymentButton = ({ amount, description }) => {
  const handlePayment = async () => {
    try {
      const response = await paymentService.createPayment(amount, description);
      
      if (response.data?.checkoutUrl) {
        // Redirect tới PayOS
        paymentService.redirectToPayOS(response.data.checkoutUrl);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Lỗi tạo thanh toán');
    }
  };
  
  return (
    <button onClick={handlePayment}>
      Thanh toán {amount.toLocaleString()} VNĐ
    </button>
  );
};
```

### **2. Frontend - Return page (Kiểm tra trạng thái)**
```typescript
// pages/payment/return.tsx
import { useEffect, useState } from 'react';
import { paymentService } from '@/lib/services/payments';

export default function PaymentReturn() {
  const [status, setStatus] = useState('checking');
  
  useEffect(() => {
    const orderId = new URLSearchParams(location.search).get('orderId');
    
    const poll = setInterval(async () => {
      const result = await paymentService.getPaymentStatus(orderId);
      
      if (result.found) {
        if (result.status === 'success') {
          setStatus('success');
          clearInterval(poll);
          setTimeout(() => window.location.href = '/success', 2000);
        } else if (['cancelled', 'failed'].includes(result.status)) {
          setStatus(result.status);
          clearInterval(poll);
        }
      }
    }, 2000);
    
    return () => clearInterval(poll);
  }, []);
  
  return (
    <div>
      {status === 'checking' && <p>⏳ Đang xác nhận thanh toán...</p>}
      {status === 'success' && <p>✅ Thanh toán thành công!</p>}
      {status === 'cancelled' && <p>❌ Thanh toán bị hủy</p>}
      {status === 'failed' && <p>❌ Thanh toán thất bại</p>}
    </div>
  );
}
```

### **3. Backend - Cấu hình**
```typescript
// app.module.ts
import { PaymentModule } from './payment-pos/payment.module';

@Module({
  imports: [
    PaymentModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 1800,  // 30 phút (giây)
    }),
  ],
})
export class AppModule {}
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Order Code**
   - Phải là `string` hoặc `number` duy nhất
   - Khuyến nghị dùng `Date.now()` hoặc UUID
   - PayOS có thể chuyển đổi kiểu dữ liệu

2. **Description (Mô tả)**
   - Tối đa 25 ký tự
   - Backend tự động cắt ngắn

3. **Callback URLs**
   - `cancelUrl`: Khi user click "Hủy" trên PayOS
   - `returnUrl`: Khi hoàn tất (thành công/thất bại)
   - Phải là URL công khai (HTTPS)

4. **Webhook Verification**
   - **Bắt buộc** xác minh signature trước khi xử lý
   - Nguy hiểm nếu bỏ qua → dễ bị giả mạo

5. **Cache TTL**
   - Success: 1 giờ (để user có thể check lại)
   - Khác: 30 phút (để database cleanup)

6. **HTTP Client**
   - Cần cài `@nestjs/axios` để enable endpoint
   - Hiện tại throw error tạm thời

---

## 🐛 Troubleshooting

| Lỗi | Nguyên Nhân | Giải Pháp |
|-----|-----------|---------|
| `Payment service temporarily disabled` | Thiếu `@nestjs/axios` | Cài: `npm install @nestjs/axios` |
| `Invalid payload` | Chữ ký webhook sai | Kiểm tra `PAYOS_CHECKSUM_KEY` |
| `Payment not found` | OrderCode không match | Kiểm tra orderCode gửi lên vs Redis key |
| Webhook không đến | URL webhook sai | Cấu hình đúng webhook URL trên PayOS dashboard |
| Polling không update | Frontend không gọi API | Kiểm tra URL `/payments-pos/status/:orderId` |

---

## 📞 Liên Hệ PayOS Support

- **Website**: https://payos.vn
- **Documentation**: https://docs.payos.vn
- **API Endpoint**: `https://api-merchant.payos.vn/v2/payment-requests`

---

**Last Updated**: December 20, 2025  
**Module Version**: 1.0.0
