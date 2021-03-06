import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Typography,
  Card,
  Steps,
  Button,
  Progress,
  Modal,
  notification,
} from 'antd';
import { State } from './interfaces';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './styles.css';
import { useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { SavedProgram } from '../../../../interfaces';

const { Title, Text } = Typography;
const { Step } = Steps;
const stateEnumVals: string[] = [
  'CREATED',
  'MENTOR_APPLICATION',
  'MENTOR_SELECTION',
  'MENTEE_APPLICATION',
  'MENTEE_SELECTION',
  'ONGOING',
  'COMPLETED',
  'REMOVED',
];
const programStates: State[] = [
  {
    stepNo: 0,
    name: 'Created',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet urna id diam suscipit ultricies eget in lorem.',
  },
  {
    stepNo: 1,
    name: 'Mentor Applicaiton Period',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet urna id diam suscipit ultricies eget in lorem. ',
  },
  {
    stepNo: 2,
    name: 'Mentor Approval Period',
    description:
      'Some descriptive text about this particular state of the program',
  },
  {
    stepNo: 3,
    name: 'Mentee Applicaiton Period',
    description:
      'Some descriptive text about this particular state of the program. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet urna id diam suscipit ultricies eget in lorem. Nulla at lorem a eros mattis iaculis et in dolor.',
  },
  {
    stepNo: 4,
    name: 'Mentee Approval Period',
    description:
      'Some descriptive text about this particular state of the program',
  },
  {
    stepNo: 5,
    name: 'Ongoing',
    description:
      'Some descriptive text about this particular state of the program',
  },
  {
    stepNo: 6,
    name: 'Completed',
    description:
      'Some descriptive text about this particular state of the program',
  },
];

function ChangeState() {
  const { programId } = useParams();
  const [programTitle, setProgramTitle] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/scholarx/programs/${programId}`)
      .then((result: AxiosResponse<SavedProgram>) => {
        if (result.status == 200) {
          setCurrentStep(stateEnumVals.indexOf(result.data.state));
          setProgramTitle(result.data.title);
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        notification.warning({
          message: 'Warning!',
          description: 'Something went wrong when fetching the program',
        });
      });
  });
  const handleStepChange = () => {
    axios({
      method: 'put',
      url: `http://localhost:8080/api/scholarx/admin/programs/${programId}/state`,
    })
      .then((result) => {
        if (result.status == 200) {
          setCurrentStep(currentStep + 1);
          notification.success({
            message: 'Success!',
            description: 'Changed the state successfully!',
          });
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        notification.warning({
          message: 'Warning!',
          description: 'Something went wrong when changing the state',
        });
      });
  };
  const { confirm } = Modal;
  const showConfirm = () => {
    confirm({
      title: 'Warning! This action is irreversible. Do you wish to proceed?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <p>
          Changing state of the <b>ScholarX Jr 2020</b> from
          <b> {programStates[currentStep].name}</b> to{' '}
          <b>{programStates[currentStep + 1].name}</b>.
        </p>
      ),
      onOk() {
        handleStepChange();
      },
    });
  };
  return (
    <div className={styles.contentWrapper}>
      <Title>Change State</Title>
      <Row justify="center">
        <Col md={20}>
          <Card className={styles.cardWrapper}>
            <Title level={3}>{programTitle}</Title>
            <Progress
              className={styles.progress}
              type="circle"
              percent={Math.round(
                ((currentStep + 1) * 100) / programStates.length
              )}
            />
            <p>
              <Text type="warning">Current State: </Text>{' '}
              {programStates[currentStep].name}
            </p>
            <p>{programStates[currentStep].description}</p>
            <Button
              type="primary"
              onClick={showConfirm}
              disabled={currentStep >= programStates.length - 1}
            >
              Change State
            </Button>
          </Card>
          <br />
        </Col>
      </Row>
      <div className={styles.bottomDoc}>
        <Steps progressDot current={currentStep}>
          {programStates.map((step: State) => {
            return (
              <Step
                key={step.stepNo}
                title={'Phase ' + (step.stepNo + 1)}
                description={step.name}
              />
            );
          })}
        </Steps>
      </div>
    </div>
  );
}

export default ChangeState;
