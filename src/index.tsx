import React, { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Home from './scenes/Home';
import SignIn from './scenes/SignIn';
import Dashboard from './scenes/Dashboard';
import { Profile } from './interfaces';
import MentorApplication from './scenes/Home/scenes/MentorApplication';
import EditMentorApplication from './scenes/Home/scenes/EditMentorApplication';
import RequestMentors from './scenes/Home/scenes/RequestMentors';
export const UserContext = createContext<Partial<Profile>>({});

function App() {
  const [user, setUser] = useState<Profile>(null);
  useEffect(() => {
    const fetchedUser: Profile = {
      id: 1,
      headline: '',
      type: '',
      lastName: '',
      firstName: '',
      email: '',
      uid: '',
      linkedinUrl: '',
      imageUrl:
        'https://d38we5ntdyxyje.cloudfront.net/858987/profile/GJQSELLC_avatar_medium_square.jpg',
      programs: [
        {
          id: 1,
          title: 'ScholarX Jr',
          headline: 'Lorem Ipsum dolor sit amet',
          imageUrl:
            'https://codingcompetitions.withgoogle.com/static/kickstart-fb.jpg',
          landingPageUrl: '',
          state: 'Created',
        },
        {
          id: 2,
          title: 'ScholarX Undergraduate',
          headline: 'Lorem Ipsum dolor sit amet',
          imageUrl:
            'https://codingcompetitions.withgoogle.com/static/hashcode-fb.jpg',
          landingPageUrl: '',
          state: 'Created',
        },
      ],
    };
    setUser(fetchedUser);
  }, []);
  return (
    <UserContext.Provider value={user}>
      <Router>
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route exact path="/home" component={Home} />
          <Route exact path="/sign-in" component={SignIn} />
          <Route path="/dashboard/:programId" component={Dashboard} />
          <Route
            path="/program/:programId/mentor/apply"
            component={MentorApplication}
          />
          <Route
            path="/program/:programId/mentor/edit"
            component={EditMentorApplication}
          />
          <Route path="/program/:programId" component={RequestMentors} />
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
