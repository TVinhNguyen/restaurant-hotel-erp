"use client";

import React, { act, useEffect, useState } from 'react';
import {
    Card, Table, Button, Modal, Form, Select, Input, Rate, message, Tag, Space, Row, Col, Statistic, Typography, Progress,
    List, Avatar, Tooltip, Divider, Alert, Tabs
} from 'antd';
import {
    StarOutlined, TrophyOutlined, UserOutlined, PlusOutlined, EyeOutlined, EditOutlined, CheckCircleOutlined,
    ClockCircleOutlined, FileTextOutlined
} from '@ant-design/icons';
import {
    getMockEvaluations, getMockEvaluationsByEmployee, addMockEvaluation, updateMockEvaluation,
    evaluationCategories, scoreDescriptions, type EmployeeEvaluation
} from '../../../data/mockEvaluations';
import { Employee, getMockEmployees } from '../../../data/mockEmployees';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

export default function EvaluationsPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedEvaluation, setSelectedEvaluation] = useState<EmployeeEvaluation | null>(null);
    const [form] = Form.useForm();
    const [evaluations, setEvaluations] = useState<EmployeeEvaluation[]>([]);
    const [activeTab, setActiveTab] = useState('all');

    const currentYear = dayjs().year();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

    useEffect(() => {
        const getAllEmployees = async () => {
            const employeesResponse = await fetch(`${API_ENDPOINT}/employees`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }).then();
            if (employeesResponse.ok) {
                const employeesData = await employeesResponse.json();
                const formattedEmployees = employeesData.data.map((employee: any, index: number) => {
                    console.log('Raw employee data:', employee);
                    return {
                        id: employee.id || `emp-${index}`,
                        userId: employeesData.userId || employeesData.data?.userId || 'Unknown',
                        fullName: employee.fullName || employee.full_name || 'Unknown',
                        position: employee.position || 'Not specified',
                        department: employee.department || 'Unassigned',
                        status: employee.status || 'active',
                    };
                });
                setEmployees(formattedEmployees);
            }
        }
        const getAllEvaluations = async () => {
            const evaluationsResponse = await fetch(`${API_ENDPOINT}/employee-evaluations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (evaluationsResponse.ok) {
                const evaluationsData = await evaluationsResponse.json();
                const formattedEvaluations = evaluationsData.data.map((evaluation: any, index: number) => {
                    console.log('Raw evaluation data evaluation:', evaluation);
                    console.log(typeof evaluation.workQualityScore);
                    return {
                        id: evaluation.id || `eval-${index}`,
                        employeeId: evaluation.employeeId || evaluation.employee_id || 'Unknown',
                        employeeName: evaluation.employeeName || evaluation.employee_name || 'Unknown',
                        evaluatorId: evaluation.evaluatorId || evaluation.evaluator_id || 'Unknown',
                        evaluatorName: evaluation.evaluatorName || evaluation.evaluator_name || 'Unknown',
                        evaluationPeriod: evaluation.evaluationPeriod || evaluation.evaluation_period || `Year ${currentYear}`,
                        evaluationDate: evaluation.evaluationDate || evaluation.evaluation_date || dayjs().format('YYYY-MM-DD'),
                        status: evaluation.status || 'draft',

                        overallScore: (
                            (Number(evaluation.workQualityScore) || 0) +
                            (Number(evaluation.productivityScore) || 0) +
                            (Number(evaluation.communicationScore) || 0) +
                            (Number(evaluation.teamworkScore) || 0) +
                            (Number(evaluation.problemSolvingScore) || 0) +
                            (Number(evaluation.punctualityScore) || 0) +
                            (Number(evaluation.initiativeScore) || 0)
                        ) / 7,
                        workQuality: {
                            score: evaluation.workQualityScore || evaluation.work_quality_score || 0,
                            comments: evaluation.workQualityComments || evaluation.work_quality_comments || ''
                        },
                        productivity: {
                            score: evaluation.productivityScore || evaluation.productivity_score || 0,
                            comments: evaluation.productivityComments || evaluation.productivity_comments || ''
                        },
                        communication: {
                            score: evaluation.communicationScore || evaluation.communication_score || 0,
                            comments: evaluation.communicationComments || evaluation.communication_comments || ''
                        },
                        teamwork: {
                            score: evaluation.teamworkScore || evaluation.teamwork_score || 0,
                            comments: evaluation.teamworkComments || evaluation.teamwork_comments || ''
                        },
                        problemSolving: {
                            score: evaluation.problemSolvingScore || evaluation.problem_solving_score || 0,
                            comments: evaluation.problemSolvingComments || evaluation.problem_solving_comments || ''
                        },
                        punctuality: {
                            score: evaluation.punctualityScore || evaluation.punctuality_score || 0,
                            comments: evaluation.punctualityComments || evaluation.punctuality_comments || ''
                        },
                        initiative: {
                            score: evaluation.initiativeScore || evaluation.initiative_score || 0,
                            comments: evaluation.initiativeComments || evaluation.initiative_comments || ''
                        },

                        recommendedAction: evaluation.recommendedAction || evaluation.recommended_action || 'maintain',
                        overallComments: evaluation.overallComments || evaluation.overall_comments || '',
                        salaryRecommendation: evaluation.salaryRecommendation || evaluation.salary_recommendation || 0,
                        strengths: evaluation.strengths || [],
                        areasForImprovement: evaluation.areasForImprovement || evaluation.areas_for_improvement || [],
                        goals: evaluation.goals || [],
                        trainingRecommendations: evaluation.trainingRecommendations || evaluation.training_recommendations || [],
                        employeeAcknowledged: evaluation.employeeAcknowledged || evaluation.employee_acknowledged || false,
                        employeeComments: evaluation.employeeComments || evaluation.employee_comments || '',
                        employeeAcknowledgedDate: evaluation.employeeAcknowledgedDate || evaluation.employee_acknowledged_date || null,
                    }
                });
                setEvaluations(formattedEvaluations);
            } else {
                message.error('Failed to fetch evaluations from server.');
                setEvaluations([]);
            }
        }
        getAllEmployees();
        getAllEvaluations();
    }, []);

    // Calculate statistics
    const completedEvaluations = evaluations.filter(evaluation => evaluation.status === 'completed' || evaluation.status === 'approved').length;
    const pendingEvaluations = evaluations.filter(evaluation => evaluation.status === 'draft' || evaluation.status === 'reviewed').length;
    const averageScore = evaluations.length > 0
        ? evaluations.reduce((sum, evaluation) => sum + (Number(evaluation.overallScore) || 0), 0) / evaluations.length
        : 0;
    const topPerformers = evaluations
        .filter(evaluation => (Number(evaluation.overallScore) || 0) >= 4.5)
        .sort((a, b) => (Number(b.overallScore) || 0) - (Number(a.overallScore) || 0))
        .slice(0, 3);

    const handleCreateEvaluation = async (values: any) => {
        try {
            const employee = employees.find(emp => emp.id === values.employeeId);
            if (!employee) {
                message.error('Employee not found!');
                return;
            }
            const evaluator = JSON.parse(localStorage.getItem('user') || '{}');
            const newEvaluationAddToDB = {
                employeeId: values.employeeId,
                employeeName: employee.fullName,
                evaluatorId: evaluator.id,
                evaluatorName: evaluator.name,
                evaluationPeriod: values.evaluationPeriod,
                evaluationDate: dayjs().format('YYYY-MM-DD'),
                status: 'draft',

                workQualityScore: values.workQuality,
                workQualityComments: values.workQualityComments,
                productivityScore: values.productivity,
                productivityComments: values.productivityComments,
                communicationScore: values.communication,
                communicationComments: values.communicationComments,
                teamworkScore: values.teamwork,
                teamworkComments: values.teamworkComments,
                problemSolvingScore: values.problemSolving,
                problemSolvingComments: values.problemSolvingComments,
                punctualityScore: values.punctuality,
                punctualityComments: values.punctualityComments,
                initiativeScore: values.initiative,
                initiativeComments: values.initiativeComments,

                overallComments: values.overallComments || '',
                strengths: values.strengths ? values.strengths.split(',').map((s: string) => s.trim()) : [],
                areasForImprovement: values.areasForImprovement ? values.areasForImprovement.split(',').map((s: string) => s.trim()) : [],
                goals: values.goals ? values.goals.split(',').map((s: string) => s.trim()) : [],

                recommendedAction: values.recommendedAction,
                salaryRecommendation: values.salaryRecommendation,
                trainingRecommendations: values.trainingRecommendations ? values.trainingRecommendations.split(',').map((s: string) => s.trim()) : [],

                employeeAcknowledged: false
            }
            await fetch(`${API_ENDPOINT}/employee-evaluations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newEvaluationAddToDB)
            });
            const newEvaluation = addMockEvaluation({
                employeeId: values.employeeId,
                employeeName: employee.fullName,
                evaluatorId: evaluator.id,
                evaluatorName: evaluator.name,
                evaluationPeriod: values.evaluationPeriod,
                evaluationDate: dayjs().format('YYYY-MM-DD'),
                status: 'draft',

                workQuality: {
                    score: values.workQuality,
                    comments: values.workQualityComments || ''
                },
                productivity: {
                    score: values.productivity,
                    comments: values.productivityComments || ''
                },
                communication: {
                    score: values.communication,
                    comments: values.communicationComments || ''
                },
                teamwork: {
                    score: values.teamwork,
                    comments: values.teamworkComments || ''
                },
                problemSolving: {
                    score: values.problemSolving,
                    comments: values.problemSolvingComments || ''
                },
                punctuality: {
                    score: values.punctuality,
                    comments: values.punctualityComments || ''
                },
                initiative: {
                    score: values.initiative,
                    comments: values.initiativeComments || ''
                },

                overallComments: values.overallComments || '',
                strengths: values.strengths ? values.strengths.split(',').map((s: string) => s.trim()) : [],
                areasForImprovement: values.areasForImprovement ? values.areasForImprovement.split(',').map((s: string) => s.trim()) : [],
                goals: values.goals ? values.goals.split(',').map((s: string) => s.trim()) : [],

                recommendedAction: values.recommendedAction,
                salaryRecommendation: values.salaryRecommendation,
                trainingRecommendations: values.trainingRecommendations ? values.trainingRecommendations.split(',').map((s: string) => s.trim()) : [],

                employeeAcknowledged: false
            });
            setEvaluations([...evaluations, newEvaluation]);
            message.success('Evaluation created successfully!');
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Error creating evaluation!');
        }
    };

    const handleCompleteEvaluation = (id: string) => {
        const updated = updateMockEvaluation(id, { status: 'completed' });
        if (updated) {
            setEvaluations([...getMockEvaluations()]);
            message.success('Evaluation marked as completed!');
        }
    };

    const showEvaluationDetail = (evaluation: EmployeeEvaluation) => {
        setSelectedEvaluation(evaluation);
        setIsDetailModalVisible(true);
    };

    const getScoreColor = (score: number) => {
        if (score >= 4.5) return '#52c41a';
        if (score >= 4.0) return '#1890ff';
        if (score >= 3.5) return '#faad14';
        if (score >= 2.5) return '#ff7a45';
        return '#ff4d4f';
    };

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'employeeName',
            key: 'employeeName',
            render: (name: string, record: EmployeeEvaluation) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        Evaluated by: {record.evaluatorName}
                    </div>
                </div>
            ),
        },
        {
            title: 'Period',
            dataIndex: 'evaluationPeriod',
            key: 'evaluationPeriod',
        },
        {
            title: 'Overall Score',
            dataIndex: 'overallScore',
            key: 'overallScore',
            render: (score: number) => {
                const safeScore = Number(score) || 0;
                return (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: getScoreColor(safeScore)
                        }}>
                            {safeScore.toFixed(2)}
                        </div>
                        <Rate
                            disabled
                            value={safeScore}
                            allowHalf
                            style={{ fontSize: '12px' }}
                        />
                    </div>
                );
            },
            sorter: (a: EmployeeEvaluation, b: EmployeeEvaluation) => (a.overallScore || 0) - (b.overallScore || 0),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusConfig = {
                    draft: { color: 'default', text: 'Draft' },
                    completed: { color: 'processing', text: 'Completed' },
                    reviewed: { color: 'warning', text: 'Under Review' },
                    approved: { color: 'success', text: 'Approved' },
                };
                const config = statusConfig[status as keyof typeof statusConfig];
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: 'Recommendation',
            dataIndex: 'recommendedAction',
            key: 'recommendedAction',
            render: (action: string) => {
                const actionConfig = {
                    promotion: { color: 'green', text: 'Promotion' },
                    salary_increase: { color: 'blue', text: 'Salary Increase' },
                    training: { color: 'orange', text: 'Training' },
                    maintain: { color: 'default', text: 'Maintain' },
                    improvement_plan: { color: 'warning', text: 'Improvement Plan' },
                    warning: { color: 'red', text: 'Warning' },
                };

                // Add safety check
                const config = actionConfig[action as keyof typeof actionConfig] || {
                    color: 'default',
                    text: action || 'Not specified'
                };

                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: 'Date',
            dataIndex: 'evaluationDate',
            key: 'evaluationDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
            sorter: (a: EmployeeEvaluation, b: EmployeeEvaluation) =>
                dayjs(a.evaluationDate).unix() - dayjs(b.evaluationDate).unix(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: EmployeeEvaluation) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => showEvaluationDetail(record)}
                    >
                        View
                    </Button>
                    {record.status === 'draft' && (
                        <Button
                            size="small"
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleCompleteEvaluation(record.id)}
                        >
                            Complete
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const filteredEvaluations = activeTab === 'all'
        ? evaluations
        : evaluations.filter(evaluation => evaluation.status === activeTab);

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>
                        <StarOutlined style={{ marginRight: '8px' }} />
                        Employee Evaluations
                    </Title>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalVisible(true)}
                    >
                        New Evaluation
                    </Button>
                </Col>
            </Row>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Total Evaluations"
                            value={evaluations.length}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Completed"
                            value={completedEvaluations}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Pending"
                            value={pendingEvaluations}
                            prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Average Score"
                            value={averageScore.toFixed(2)}
                            prefix={<StarOutlined style={{ color: '#1890ff' }} />}
                            suffix="/ 5.0"
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                {/* Top Performers */}
                <Col xs={24} md={12}>
                    <Card title="Top Performers" extra={<TrophyOutlined />}>
                        <List
                            dataSource={topPerformers}
                            renderItem={(evaluation, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                style={{
                                                    backgroundColor: index === 0 ? '#faad14' : '#1890ff'
                                                }}
                                                icon={<UserOutlined />}
                                            />
                                        }
                                        title={
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span>{evaluation.employeeName}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Rate
                                                        disabled
                                                        value={evaluation.overallScore}
                                                        allowHalf
                                                        style={{ fontSize: '12px' }}
                                                    />
                                                    <Text strong style={{ color: getScoreColor(evaluation.overallScore) }}>
                                                        {evaluation.overallScore.toFixed(2)}
                                                    </Text>
                                                </div>
                                            </div>
                                        }
                                        description={`${evaluation.evaluationPeriod} - ${evaluation.recommendedAction.replace('_', ' ')}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* Performance Distribution */}
                <Col xs={24} md={12}>
                    <Card title="Performance Distribution">
                        {[
                            { range: '4.5 - 5.0', label: 'Excellent', color: '#52c41a' },
                            { range: '4.0 - 4.4', label: 'Good', color: '#1890ff' },
                            { range: '3.5 - 3.9', label: 'Average', color: '#faad14' },
                            { range: '3.0 - 3.4', label: 'Below Average', color: '#ff7a45' },
                            { range: '1.0 - 2.9', label: 'Poor', color: '#ff4d4f' },
                        ].map(item => {
                            const count = evaluations.filter(evaluation => {
                                const [min, max] = item.range.split(' - ').map(Number);
                                return evaluation.overallScore >= min && evaluation.overallScore <= max;
                            }).length;
                            const percentage = (count / evaluations.length) * 100;

                            return (
                                <div key={item.range} style={{ marginBottom: '12px' }}>
                                    <Row justify="space-between" style={{ marginBottom: '4px' }}>
                                        <Col>{item.label} ({item.range})</Col>
                                        <Col>{count} employees</Col>
                                    </Row>
                                    <Progress
                                        percent={percentage}
                                        strokeColor={item.color}
                                        showInfo={false}
                                    />
                                </div>
                            );
                        })}
                    </Card>
                </Col>
            </Row>

            {/* Evaluations Table */}
            <Card>
                <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: '16px' }}>
                    <TabPane tab="All Evaluations" key="all" />
                    <TabPane tab="Draft" key="draft" />
                    <TabPane tab="Completed" key="completed" />
                    <TabPane tab="Under Review" key="reviewed" />
                    <TabPane tab="Approved" key="approved" />
                </Tabs>

                <Table
                    columns={columns}
                    dataSource={filteredEvaluations}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>

            {/* Create Evaluation Modal */}
            <Modal
                title="Create Employee Evaluation"
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={800}
                style={{ top: 20 }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateEvaluation}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Employee"
                                name="employeeId"
                                rules={[{ required: true, message: 'Please select an employee!' }]}
                            >
                                <Select placeholder="Select employee">
                                    {employees != null && employees.filter(emp => emp.status === 'active').map(employee => (
                                        <Select.Option key={employee.id} value={employee.id}>
                                            {employee.fullName} - {employee.position}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Evaluation Period"
                                name="evaluationPeriod"
                                rules={[{ required: true, message: 'Please enter evaluation period!' }]}
                            >
                                <Select placeholder="Select period">
                                    <Select.Option value={`Q1 ${currentYear}`}>Q1 {currentYear}</Select.Option>
                                    <Select.Option value={`Q2 ${currentYear}`}>Q2 {currentYear}</Select.Option>
                                    <Select.Option value={`Q3 ${currentYear}`}>Q3 {currentYear}</Select.Option>
                                    <Select.Option value={`Q4 ${currentYear}`}>Q4 {currentYear}</Select.Option>
                                    <Select.Option value={`${currentYear} Annual`}>{currentYear} Annual</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Performance Categories</Divider>

                    {evaluationCategories.map(category => (
                        <div key={category.key}>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        label={category.label}
                                        name={category.key}
                                        rules={[{ required: true, message: `Please rate ${category.label.toLowerCase()}!` }]}
                                    >
                                        <Rate allowHalf />
                                    </Form.Item>
                                </Col>
                                <Col span={16}>
                                    <Form.Item
                                        label="Comments"
                                        name={`${category.key}Comments`}
                                    >
                                        <Input placeholder={`Comments on ${category.label.toLowerCase()}...`} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    ))}

                    <Divider orientation="left">Overall Assessment</Divider>

                    <Form.Item
                        label="Overall Comments"
                        name="overallComments"
                        rules={[{ required: true, message: 'Please provide overall comments!' }]}
                    >
                        <TextArea rows={3} placeholder="Provide comprehensive feedback..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Strengths (comma-separated)"
                                name="strengths"
                            >
                                <TextArea rows={2} placeholder="Leadership, Communication, ..." />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Areas for Improvement (comma-separated)"
                                name="areasForImprovement"
                            >
                                <TextArea rows={2} placeholder="Time management, ..." />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Goals (comma-separated)"
                                name="goals"
                            >
                                <TextArea rows={2} placeholder="Complete certification, ..." />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Recommendations</Divider>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Recommended Action"
                                name="recommendedAction"
                                rules={[{ required: true, message: 'Please select recommended action!' }]}
                            >
                                <Select placeholder="Select action">
                                    <Select.Option value="promotion">Promotion</Select.Option>
                                    <Select.Option value="salary_increase">Salary Increase</Select.Option>
                                    <Select.Option value="training">Training</Select.Option>
                                    <Select.Option value="maintain">Maintain Current Level</Select.Option>
                                    <Select.Option value="improvement_plan">Improvement Plan</Select.Option>
                                    <Select.Option value="warning">Warning</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Salary Recommendation (VNĐ)"
                                name="salaryRecommendation"
                            >
                                <Input type="number" placeholder="New salary amount" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Training Recommendations (comma-separated)"
                        name="trainingRecommendations"
                    >
                        <TextArea rows={2} placeholder="Leadership training, Technical certification, ..." />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setIsModalVisible(false);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Create Evaluation
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Evaluation Detail Modal */}
            <Modal
                title="Evaluation Details"
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={null}
                width={900}
                style={{ top: 20 }}
            >
                {selectedEvaluation && (
                    <div>
                        {/* Employee Info */}
                        <Card size="small" style={{ marginBottom: '16px' }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Text strong>Employee:</Text> {selectedEvaluation.employeeName}
                                </Col>
                                <Col span={6}>
                                    <Text strong>Period:</Text> {selectedEvaluation.evaluationPeriod}
                                </Col>
                                <Col span={6}>
                                    <Text strong>Evaluator:</Text> {selectedEvaluation.evaluatorName}
                                </Col>
                                <Col span={6}>
                                    <Text strong>Date:</Text> {dayjs(selectedEvaluation.evaluationDate).format('DD/MM/YYYY')}
                                </Col>
                            </Row>
                        </Card>

                        {/* Performance Scores */}
                        <Card size="small" title="Performance Scores" style={{ marginBottom: '16px' }}>
                            <Row gutter={[16, 16]}>
                                {evaluationCategories.map(category => {
                                    const categoryData = selectedEvaluation[category.key as keyof EmployeeEvaluation] as any;
                                    return (
                                        <Col span={12} key={category.key}>
                                            <div style={{ padding: '8px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                    <Text strong>{category.label}</Text>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Rate disabled value={categoryData.score} allowHalf style={{ fontSize: '14px' }} />
                                                        <Text style={{ color: getScoreColor(categoryData.score), fontWeight: 'bold' }}>
                                                            {categoryData.score}
                                                        </Text>
                                                    </div>
                                                </div>
                                                {categoryData.comments && (
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        {categoryData.comments}
                                                    </Text>
                                                )}
                                            </div>
                                        </Col>
                                    );
                                })}
                            </Row>

                            <Divider />

                            <Row justify="center">
                                <Col>
                                    <div style={{ textAlign: 'center' }}>
                                        <Title level={4} style={{ margin: 0, color: getScoreColor(selectedEvaluation.overallScore) }}>
                                            Overall Score: {selectedEvaluation.overallScore.toFixed(2)} / 5.0
                                        </Title>
                                        <Rate
                                            disabled
                                            value={selectedEvaluation.overallScore}
                                            allowHalf
                                            style={{ fontSize: '20px' }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        {/* Assessment Details */}
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card size="small" title="Overall Comments">
                                    <Paragraph>{selectedEvaluation.overallComments}</Paragraph>
                                </Card>
                            </Col>

                            <Col span={8}>
                                <Card size="small" title="Strengths">
                                    <List
                                        size="small"
                                        dataSource={selectedEvaluation.strengths}
                                        renderItem={item => (
                                            <List.Item style={{ padding: '4px 0' }}>
                                                <Text>• {item}</Text>
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>

                            <Col span={8}>
                                <Card size="small" title="Areas for Improvement">
                                    <List
                                        size="small"
                                        dataSource={selectedEvaluation.areasForImprovement}
                                        renderItem={item => (
                                            <List.Item style={{ padding: '4px 0' }}>
                                                <Text>• {item}</Text>
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>

                            <Col span={8}>
                                <Card size="small" title="Goals">
                                    <List
                                        size="small"
                                        dataSource={selectedEvaluation.goals}
                                        renderItem={item => (
                                            <List.Item style={{ padding: '4px 0' }}>
                                                <Text>• {item}</Text>
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        {/* Recommendations */}
                        <Card size="small" title="Recommendations" style={{ marginTop: '16px' }}>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Text strong>Action: </Text>
                                    <Tag color={selectedEvaluation.recommendedAction === 'promotion' ? 'green' : 'blue'}>
                                        {selectedEvaluation.recommendedAction.replace('_', ' ')}
                                    </Tag>
                                </Col>
                                {selectedEvaluation.salaryRecommendation && (
                                    <Col span={8}>
                                        <Text strong>Salary: </Text>
                                        <Text>{selectedEvaluation.salaryRecommendation.toLocaleString()} VNĐ</Text>
                                    </Col>
                                )}
                                <Col span={8}>
                                    <Text strong>Status: </Text>
                                    <Tag color={selectedEvaluation.status === 'approved' ? 'green' : 'blue'}>
                                        {selectedEvaluation.status}
                                    </Tag>
                                </Col>
                            </Row>

                            {selectedEvaluation.trainingRecommendations && selectedEvaluation.trainingRecommendations.length > 0 && (
                                <div style={{ marginTop: '12px' }}>
                                    <Text strong>Training Recommendations:</Text>
                                    <List
                                        size="small"
                                        dataSource={selectedEvaluation.trainingRecommendations}
                                        renderItem={item => (
                                            <List.Item style={{ padding: '4px 0' }}>
                                                <Text>• {item}</Text>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            )}
                        </Card>

                        {/* Employee Acknowledgment */}
                        {selectedEvaluation.employeeAcknowledged && (
                            <Alert
                                message="Employee Acknowledgment"
                                description={
                                    <div>
                                        <Text>Acknowledged on: {dayjs(selectedEvaluation.employeeAcknowledgedDate).format('DD/MM/YYYY')}</Text>
                                        {selectedEvaluation.employeeComments && (
                                            <div style={{ marginTop: '8px' }}>
                                                <Text strong>Employee Comments: </Text>
                                                <Text>{selectedEvaluation.employeeComments}</Text>
                                            </div>
                                        )}
                                    </div>
                                }
                                type="success"
                                style={{ marginTop: '16px' }}
                            />
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
