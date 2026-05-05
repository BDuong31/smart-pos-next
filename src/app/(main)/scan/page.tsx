'use client'
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spin, Modal, Button, Result } from 'antd';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ITableDetail } from '@/interfaces/table';
import { getTableById } from '@/apis/table';
import { SplashScreen } from '@/components/loading';

const ScanPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const tableId = params.get('tableId');

  const [loading, setLoading] = useState(true);
  const [table, setTable] = useState<ITableDetail>();

  const getTable = async () => {
    try {
      const response = await getTableById(tableId || '');
      if (response) {
        setTable(response.data);
      }
    } catch (error) {
      console.error('Error fetching table:', error);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (tableId) {
      getTable();
    }
    setLoading(false);
  }, [tableId]);

  const handleLogicByStatus = (tableStatus: string, id: string) => {
    switch (tableStatus) {
      case 'available': // BÀN TRỐNG
        sessionStorage.setItem('customer_table_id', id);
        router.push('/menu');
        break;

      case 'occupied': // BÀN CÓ NGƯỜI
        Modal.confirm({
          title: 'Bàn đang có khách ngồi',
          icon: <ExclamationCircleOutlined />,
          content: 'Bàn này hiện đang được sử dụng. Bạn có chắc chắn muốn tiếp tục đặt món tại bàn này không?',
          okText: 'Xác nhận ngồi đây',
          cancelText: 'Quay lại',
          onOk: () => {
            sessionStorage.setItem('customer_table_id', id);
            router.push('/menu');
          },
          onCancel: () => router.push('/') // Hoặc trang chủ của quán
        });
        break;

      default:
        // Các trạng thái khác (reserved, maintenance) sẽ được hiển thị ở phần UI bên dưới
        break;
    }
  };

  useEffect(() => {
    if (table) {
      handleLogicByStatus(table.status, table.id);
    }
  }, [table]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <SplashScreen className="" />
      </div>
    );
  }

  // GIAO DIỆN HIỂN THỊ KHI GẶP TRẠNG THÁI KHÔNG THỂ NGỒI (Reserved / Maintenance)
  return (
    <div className="h-screen flex items-center justify-center p-6 bg-gray-50">
      {table?.status === 'reserved' && (
        <Result
          status="info"
          title="Bàn đã được đặt trước"
          subTitle="Rất tiếc, bàn này đã có khách đặt lịch. Vui lòng di chuyển qua bàn trống khác và quét mã lại."
          extra={<Button type="primary" onClick={() => window.location.href = '/'}>Xem sơ đồ bàn trống</Button>}
        />
      )}

      {table?.status === 'maintenance' && (
        <Result
          status="error"
          title="Bàn đang bảo trì"
          subTitle="Bàn này hiện không phục vụ do đang trong quá trình bảo trì hoặc vệ sinh. Xin lỗi bạn vì sự bất tiện này!"
          extra={<Button onClick={() => window.location.href = '/'}>Quay lại</Button>}
        />
      )}
    </div>
  );
};

export default ScanPage;