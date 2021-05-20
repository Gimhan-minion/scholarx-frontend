import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  Col,
  List,
  notification,
  Row,
  Spin,
  Typography,
} from 'antd';
import { Mentor } from '../../../../../../interfaces';
import { useParams } from 'react-router';
import axios, { AxiosResponse } from 'axios';
import styles from '../styles.css';
import { API_URL } from '../../../../../../constants';

function Mentors() {
  const { programId } = useParams();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { Title, Paragraph } = Typography;

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${API_URL}/programs/${programId}/mentors?states=APPROVED`, {
        withCredentials: true,
      })
      .then((result: AxiosResponse<Mentor[]>) => {
        if (result.status == 200) {
          setIsLoading(false);
          setMentors(result.data);
        } else {
          throw new Error();
        }
      })
      .catch((error) => {
        setIsLoading(false);
        notification.error({
          message: error.toString(),
          description: 'Something went wrong when fetching the mentors',
        });
      });
  }, []);

  return (
    <div className={styles.container}>
      <Spin tip="Loading..." spinning={isLoading}>
        <List
          grid={{
            gutter: 8,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          itemLayout="horizontal"
          size="large"
          pagination={{
            pageSize: 8,
          }}
          dataSource={mentors}
          renderItem={(item: Mentor) => (
            <List.Item key={item.id}>
              <Card hoverable className={styles.mentorCardHeight}>
                <Row justify="center">
                  <Col>
                    <Row justify="center">
                      <Avatar size={64} src={item.profile.imageUrl} />
                      <Title level={4} className={styles.cardTitle}>
                        {item.profile.firstName} {item.profile.lastName}
                      </Title>
                      <Paragraph>{item.profile.headline}</Paragraph>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      </Spin>
    </div>
  );
}

export default Mentors;