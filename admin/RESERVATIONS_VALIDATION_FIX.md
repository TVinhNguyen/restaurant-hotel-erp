# Reservations Form Validation Fix

## Problem
Form validation errors when entering numbers in `Adults` and `Children` fields:
- Error message: "Adults is not a valid undefined"
- Caused by incorrect validation rules in Ant Design Form.Item

## Root Cause
```tsx
// ❌ WRONG - Missing type specification
rules={[{ required: true, min: 1 }]}
```

When using `min` validation with `InputNumber`, you must specify `type: 'number'` in the rule.

## Solution

### Before (Incorrect)
```tsx
<Form.Item
    label="Adults"
    name="adults"
    rules={[{ required: true, min: 1 }]}
>
    <InputNumber min={1} style={{ width: '100%' }} />
</Form.Item>

<Form.Item
    label="Children"
    name="children"
>
    <InputNumber min={0} style={{ width: '100%' }} />
</Form.Item>
```

### After (Correct)
```tsx
<Form.Item
    label="Adults"
    name="adults"
    rules={[
        { required: true, message: 'Please enter number of adults!' },
        { type: 'number', min: 1, message: 'At least 1 adult required!' }
    ]}
>
    <InputNumber min={1} style={{ width: '100%' }} />
</Form.Item>

<Form.Item
    label="Children"
    name="children"
    rules={[
        { type: 'number', min: 0, message: 'Children must be 0 or more!' }
    ]}
>
    <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
</Form.Item>
```

## Files Fixed
1. ✅ `/src/app/reservations/create/page.tsx` - Create reservation form
2. ✅ `/src/app/reservations/[id]/edit/page.tsx` - Edit reservation form

## Key Points
- **Always specify `type: 'number'`** when using numeric validation rules (`min`, `max`, etc.)
- **Add custom error messages** for better UX
- **Set `defaultValue`** for optional numeric fields (like `children: 0`)

## Testing
1. ✅ Create reservation - Adults field accepts numbers
2. ✅ Create reservation - Children field accepts numbers
3. ✅ Edit reservation - Adults field accepts numbers
4. ✅ Edit reservation - Children field accepts numbers
5. ✅ Validation works: Minimum 1 adult required
6. ✅ Validation works: Children can be 0 or more

## References
- [Ant Design Form Rules](https://ant.design/components/form#rule)
- [Ant Design InputNumber](https://ant.design/components/input-number)
