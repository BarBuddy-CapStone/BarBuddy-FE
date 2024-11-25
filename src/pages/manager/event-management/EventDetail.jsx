import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, message, Modal, Radio, Row, Space, Spin, Table, Tag, TimePicker, Upload } from 'antd';
import Select from 'antd/lib/select';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteEvent, getEventByEventId, updateEvent } from '../../../lib/service/eventManagerService';

const parseImageUrls = (imageString) => {
  if (!imageString) return [];
  return imageString.split(', ').filter(url => url.trim() !== '');
};

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [eventType, setEventType] = useState('specific');
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = (await getEventByEventId(eventId)).data;
        if (response) {
          setEvent(response.data);
          const urls = parseImageUrls(response.data.images);
          setImageUrls(urls);
          setFileList(urls.map((url, index) => ({
            uid: `-${index}`,
            name: `image-${index}.png`,
            status: 'done',
            url: url,
          })));
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sự kiện:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  const isEveryDay = (timeResponses) => {
    if (!timeResponses || timeResponses.length !== 7) return false;
    const days = timeResponses.map(t => t.dayOfWeek).sort((a, b) => a - b);
    return days.every((day, index) => day === index);
  };

  const timeColumns = [
    {
      title: 'Thời gian',
      dataIndex: 'dayOfWeek',
      key: 'dayOfWeek',
      render: (day, record, index) => {
        if (index === 0 && isEveryDay(event.eventTimeResponses)) {
          return 'Mỗi ngày trong tuần';
        }
        
        if (record.date !== null) {
          return new Date(record.date).toLocaleDateString('vi-VN');
        } else {
          const days = {
            0: 'Chủ nhật',
            1: 'Thứ hai',
            2: 'Thứ ba',
            3: 'Thứ tư',
            4: 'Thứ năm',
            5: 'Thứ sáu',
            6: 'Thứ bảy'
          };
          return `${days[day]} hằng tuần`;
        }
      }
    },
    {
      title: 'Giờ bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time) => time.slice(0, 5)
    },
    {
      title: 'Giờ kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (time) => time.slice(0, 5)
    }
  ];

  const getTableData = () => {
    if (isEveryDay(event.eventTimeResponses)) {
      return [{
        ...event.eventTimeResponses[0],
        key: 'everyday'
      }];
    }
    return event.eventTimeResponses.map((time, index) => ({
      ...time,
      key: index
    }));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (imageUrls.length - 1) : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      eventName: event.eventName,
      description: event.description,
      ...(event.eventVoucherResponse && {
        eventVoucherName: event.eventVoucherResponse.eventVoucherName,
        voucherCode: event.eventVoucherResponse.voucherCode,
        discount: event.eventVoucherResponse.discount,
        maxPrice: event.eventVoucherResponse.maxPrice,
        quantity: event.eventVoucherResponse.quantity,
      }),
      eventTimes: event.eventTimeResponses.map(time => ({
        timeEventId: time.timeEventId,
        date: time.date ? moment(time.date) : null,
        startTime: moment(time.startTime, 'HH:mm:ss'),
        endTime: moment(time.endTime, 'HH:mm:ss'),
        dayOfWeek: time.dayOfWeek
      }))
    });
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Thêm hình ảnh</div>
    </div>
  );

  const handleUpdateEvent = async (values) => {
    try {
      // Xử lý ảnh mới thành base64
      const newImagesPromises = fileList
        .filter(file => file.originFileObj)
        .map(file => getBase64(file.originFileObj));
      
      // Đợi tất cả ảnh được chuyển thành base64
      const newImagesBase64 = await Promise.all(newImagesPromises);
      
      // Lấy url của những ảnh cũ
      const oldImages = fileList
        .filter(file => file.url)
        .map(file => file.url);

      const updateEventRequest = {
        barId: event.barId,
        eventName: values.eventName,
        description: values.description,
        images: newImagesBase64,
        oldImages: oldImages,
        isEveryWeek: values.eventType === 'weekly',
        updateEventTimeRequests: values.eventTimes.map(time => ({
          timeEventId: time.timeEventId,
          date: values.eventType === 'specific' ? time.date.format('YYYY-MM-DD') : null,
          startTime: time.startTime.format('HH:mm:ss'),
          endTime: time.endTime.format('HH:mm:ss'),
          dayOfWeek: values.eventType === 'weekly' ? time.dayOfWeek : null
        })),
        updateEventVoucherRequests: event.eventVoucherResponse ? {
          eventVoucherName: values.eventVoucherName,
          voucherCode: values.voucherCode,
          discount: values.discount,
          maxPrice: values.maxPrice,
          quantity: values.quantity,
          eventVoucherId: event.eventVoucherResponse.eventVoucherId
        } : null
      };

      const response = await updateEvent(eventId, updateEventRequest);
      if (response.data) {
        message.success('Cập nhật sự kiện thành công');
        // Chuyển hướng về trang quản lý sự kiện
        navigate('/manager/event-management');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật sự kiện:', error);
      message.error('Cập nhật sự kiện thất bại');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteEvent(eventId);
      if (response.data) {
        message.success('Xóa sự kiện thành công');
        navigate('/manager/event-management');
      }
    } catch (error) {
      console.error('Lỗi khi xóa sự kiện:', error);
      message.error('Xóa sự kiện thất bại');
    }
    setIsDeleteModalVisible(false);
  };

  const renderEventForm = () => {
    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateEvent}
        initialValues={{
          eventName: event.eventName,
          description: event.description,
          ...(event.eventVoucherResponse && {
            eventVoucherName: event.eventVoucherResponse.eventVoucherName,
            voucherCode: event.eventVoucherResponse.voucherCode,
            discount: event.eventVoucherResponse.discount,
            maxPrice: event.eventVoucherResponse.maxPrice,
            quantity: event.eventVoucherResponse.quantity,
          }),
          eventTimes: event.eventTimeResponses.map(time => ({
            timeEventId: time.timeEventId,
            date: time.date ? moment(time.date) : null,
            startTime: moment(time.startTime, 'HH:mm:ss'),
            endTime: moment(time.endTime, 'HH:mm:ss'),
            dayOfWeek: time.dayOfWeek
          })),
          eventType: eventType
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card type="inner" title="Thông tin cơ bản">
              <Form.Item
                name="eventName"
                label="Tên sự kiện"
                rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Card>
          </Col>

          <Col span={24}>
            <Card type="inner" title="Thông tin voucher">
              <Form.Item
                name="eventVoucherName"
                label="Tên voucher"
                rules={[{ required: true, message: 'Vui lòng nhập tên voucher' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="voucherCode"
                label="Mã voucher"
                rules={[{ required: true, message: 'Vui lòng nhập mã voucher' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="discount"
                label="Giảm giá (%)"
                rules={[{ required: true, message: 'Vui lòng nhập % giảm giá' }]}
              >
                <InputNumber min={0} max={100} />
              </Form.Item>

              <Form.Item
                name="maxPrice"
                label="Giá tối đa"
                rules={[{ required: true, message: 'Vui lòng nhập giá tối đa' }]}
              >
                <InputNumber 
                  min={0} 
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
              >
                <InputNumber min={1} />
              </Form.Item>
            </Card>
          </Col>

          <Col span={24}>
            <Card type="inner" title="Lịch trình sự kiện">
              <Form.Item
                name="eventType"
                label="Loại Sự Kiện"
              >
                <Radio.Group 
                  onChange={(e) => setEventType(e.target.value)}
                  value={eventType}
                >
                  <Radio value="specific">Ngày cụ thể</Radio>
                  <Radio value="weekly">Hàng tuần</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.List name="eventTimes">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        {eventType === 'specific' ? (
                          <Form.Item
                            {...restField}
                            name={[name, 'date']}
                            label="Ngày"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                          >
                            <DatePicker format="DD/MM/YYYY" />
                          </Form.Item>
                        ) : (
                          <Form.Item
                            {...restField}
                            name={[name, 'dayOfWeek']}
                            label="Thứ"
                            rules={[{ required: true, message: 'Vui lòng chọn thứ' }]}
                          >
                            <Select>
                              <Select.Option value={1}>Thứ hai</Select.Option>
                              <Select.Option value={2}>Thứ ba</Select.Option>
                              <Select.Option value={3}>Thứ tư</Select.Option>
                              <Select.Option value={4}>Thứ năm</Select.Option>
                              <Select.Option value={5}>Thứ sáu</Select.Option>
                              <Select.Option value={6}>Thứ bảy</Select.Option>
                              <Select.Option value={7}>Chủ nhật</Select.Option>
                            </Select>
                          </Form.Item>
                        )}

                        <Form.Item
                          {...restField}
                          name={[name, 'startTime']}
                          label="Giờ bắt đầu"
                          rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
                        >
                          <TimePicker format="HH:mm:ss" />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'endTime']}
                          label="Giờ kết thúc"
                          rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}
                        >
                          <TimePicker format="HH:mm:ss" />
                        </Form.Item>

                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Thêm lịch trình
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Card>
          </Col>

          <Col span={24}>
            <Card type="inner" title="Thêm Hình Ảnh">
              <Form.Item
                label="Hình ảnh sự kiện"
                extra="Chỉ chấp nhận file ảnh JPEG, JPG, PNG hoặc GIF, kích thước tối đa 5MB"
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleChange}
                  onPreview={async (file) => {
                    if (!file.url && !file.preview) {
                      file.preview = await getBase64(file.originFileObj);
                    }
                    window.open(file.url || file.preview, '_blank');
                  }}
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/');
                    const isLt5M = file.size / 1024 / 1024 < 5;
                    
                    if (!isImage) {
                      message.error('Bạn chỉ có thể tải lên file ảnh!');
                      return false;
                    }
                    
                    if (!isLt5M) {
                      message.error('Ảnh phải nhỏ hơn 5MB!');
                      return false;
                    }
                    
                    return false; // Return false to stop auto upload
                  }}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Card>
          </Col>

          <Col span={24}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Lưu thay đổi
                </Button>
                <Button onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  // Hàm chuyển đổi file thành base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Lấy phần base64 string (bỏ qua phần data:image/xxx;base64,)
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!event) {
    return <div>Không tìm thấy thông tin sự kiện</div>;
  }

  return (
    <div className="event-detail-container" style={{ padding: '24px' }}>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button 
              icon={<ArrowBackIcon />} 
              onClick={() => navigate('/manager/event-management')}
              style={{ display: 'flex', alignItems: 'center' }}
            />
            <span>Chi tiết sự kiện</span>
          </div>
        } 
        bordered={false}
        extra={
          <Space>
            <Button 
              type="primary" 
              danger
              onClick={() => setIsDeleteModalVisible(true)}
            >
              Xóa sự kiện
            </Button>
            {!isEditing && (
              <Button type="primary" onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            )}
          </Space>
        }
      >
        {isEditing ? (
          // Form chỉnh sửa
          renderEventForm()
        ) : (
          // Hiển thị thông tin
          <Row gutter={[16, 16]}>
            <Col span={24} md={12}>
              <Card type="inner" title="Thông tin cơ bản">
                <p><strong>Mã sự kiện:</strong> {event.eventId}</p>
                <p><strong>Tên sự kiện:</strong> {event.eventName}</p>
                <p><strong>Mã quán bar:</strong> {event.barId}</p>
                <p><strong>Mô tả:</strong> {event.description}</p>
              </Card>
            </Col>
            
            <Col span={24} md={12}>
              <Card type="inner" title="Hình ảnh sự kiện">
                {imageUrls.length > 0 && (
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={imageUrls[currentImageIndex]} 
                      alt={`Event ${currentImageIndex + 1}`} 
                      style={{ 
                        maxWidth: '100%', 
                        height: 'auto',
                        borderRadius: '8px'
                      }} 
                    />
                    {imageUrls.length > 1 && (
                      <>
                        <Button
                          icon={<ArrowBackIosNewIcon />}
                          onClick={handlePrevImage}
                          style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255, 255, 255, 0.8)',
                            border: 'none',
                            borderRadius: '50%',
                            minWidth: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        />
                        <Button
                          icon={<ArrowForwardIosIcon />}
                          onClick={handleNextImage}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255, 255, 255, 0.8)',
                            border: 'none',
                            borderRadius: '50%',
                            minWidth: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '12px'
                        }}>
                          {currentImageIndex + 1}/{imageUrls.length}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Card>
            </Col>

            <Col span={24}>
              <Card type="inner" title="Thông tin voucher">
                {event.eventVoucherResponse ? (
                  <>
                    <p><strong>Tên voucher:</strong> {event.eventVoucherResponse.eventVoucherName}</p>
                    <p><strong>Mã voucher:</strong> {event.eventVoucherResponse.voucherCode}</p>
                    <p><strong>Giảm giá:</strong> {event.eventVoucherResponse.discount}%</p>
                    <p><strong>Giá tối đa:</strong> {event.eventVoucherResponse.maxPrice.toLocaleString('vi-VN')} VNĐ</p>
                    <p><strong>Số lượng:</strong> {event.eventVoucherResponse.quantity}</p>
                    <p>
                      <strong>Trạng thái:</strong> 
                      <Tag color={event.eventVoucherResponse.status ? 'green' : 'red'} style={{ marginLeft: '8px' }}>
                        {event.eventVoucherResponse.status ? 'Còn hiệu lực' : 'Hết hiệu lực'}
                      </Tag>
                    </p>
                  </>
                ) : (
                  <p>Không có thông tin voucher</p>
                )}
              </Card>
            </Col>

            <Col span={24}>
              <Card type="inner" title="Lịch trình sự kiện">
                <Table 
                  columns={timeColumns} 
                  dataSource={getTableData()} 
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        )}
      </Card>
      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa sự kiện này không?</p>
      </Modal>
    </div>
  );
}
