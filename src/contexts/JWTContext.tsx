import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
import { request } from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';
import authApi from 'src/apis/auth';
import staffApi from 'src/apis/staff';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken =
          typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';

        // if (accessToken && isValidToken(accessToken)) {
        if (accessToken) {
          // fake accounts
          setSession(accessToken);
          const authorizeRes = await staffApi.authorizeStaff();
          const userData = authorizeRes.data;

          // setTimeout(() => {
          //   if (
          //     accessToken ===
          //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Nzc0NTJmZi0wODkzLTRkZTEtOWZjMS05NDQzZWNlYWI1YjAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTWFuYWdlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiZjg5ZDgyYzItNGRmMS00MDhjLWFhNTUtNDE2ZTBkMjVmNmM2IiwiZXhwIjoxNjkzNjY4NjU5LCJpc3MiOiJodHRwczovL3Byb2QuZmluZS1hcGkuc21qbGUudm4vIiwiYXVkIjoiaHR0cHM6Ly9wcm9kLmZpbmUtYXBpLnNtamxlLnZuLyJ9.z8dyLqFTGIIMohRRtTwedxFTJfXFrLt8lv2mpbCBrzM'
          //   ) {
          //     setSession(
          //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Nzc0NTJmZi0wODkzLTRkZTEtOWZjMS05NDQzZWNlYWI1YjAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTWFuYWdlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiZjg5ZDgyYzItNGRmMS00MDhjLWFhNTUtNDE2ZTBkMjVmNmM2IiwiZXhwIjoxNjkzNjY4NjU5LCJpc3MiOiJodHRwczovL3Byb2QuZmluZS1hcGkuc21qbGUudm4vIiwiYXVkIjoiaHR0cHM6Ly9wcm9kLmZpbmUtYXBpLnNtamxlLnZuLyJ9.z8dyLqFTGIIMohRRtTwedxFTJfXFrLt8lv2mpbCBrzM'
          //     );
          //     const user = {
          //       id: '8864c717-587d-472a-929a-8e5f298024da-0',
          //       displayName: 'Fox Manager',
          //       email: 'foxmanager@fine.com',
          //       password: 'demo1234',
          //       photoURL: '/assets/images/mascot_2.png',
          //       phoneNumber: '+84 764420250',
          //       country: 'Viet Nam',
          //       address: 'FPT University HCM',
          //       city: 'HCM City',
          //       about: 'Fox Manager rules the F&B Management',
          //       role: 'admin',
          //       isPublic: true,
          //     };
          //     dispatch({
          //       type: Types.Initial,
          //       payload: {
          //         isAuthenticated: true,
          //         user,
          //       },
          //     });
          //   }
          //   if (
          //     accessToken ===
          //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Nzc0NTJmZi0wODkzLTRkZTEtOWZjMS05NDQzZWNlYWI1YjAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiU3RhZmYiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImY4OWQ4MmMyLTRkZjEtNDA4Yy1hYTU1LTQxNmUwZDI1ZjZjNiIsImV4cCI6MTY5MzY2ODY1OSwiaXNzIjoiaHR0cHM6Ly9wcm9kLmZpbmUtYXBpLnNtamxlLnZuLyIsImF1ZCI6Imh0dHBzOi8vcHJvZC5maW5lLWFwaS5zbWpsZS52bi8ifQ.W_RYslosZDwm3mOg32Gyb0X3DpZ-F4h0WAxHP_xdSBA'
          //   ) {
          //     setSession(
          //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Nzc0NTJmZi0wODkzLTRkZTEtOWZjMS05NDQzZWNlYWI1YjAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiU3RhZmYiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImY4OWQ4MmMyLTRkZjEtNDA4Yy1hYTU1LTQxNmUwZDI1ZjZjNiIsImV4cCI6MTY5MzY2ODY1OSwiaXNzIjoiaHR0cHM6Ly9wcm9kLmZpbmUtYXBpLnNtamxlLnZuLyIsImF1ZCI6Imh0dHBzOi8vcHJvZC5maW5lLWFwaS5zbWpsZS52bi8ifQ.W_RYslosZDwm3mOg32Gyb0X3DpZ-F4h0WAxHP_xdSBA'
          //     );
          const user = {
            id: userData.id,
            displayName: userData.name,
            email: 'foxmanager@fine.com',
            password: 'zaQ@1234',
            photoURL: '/assets/images/mascot_2.png',
            phoneNumber: '+84 764420250',
            country: 'Viet Nam',
            address: 'FPT University HCM',
            city: 'HCM City',
            about: 'Fox Staff runs the F&B Management',
            role: userData.roleType === 1 ? 'admin' : userData.roleType === 2 ? 'staff' : 'driver',
            isPublic: true,
            storeId: userData.storeId,
          };
          //     dispatch({
          //       type: Types.Initial,
          //       payload: {
          //         isAuthenticated: true,
          //         user,
          //       },
          //     });
          //   }
          // }, 1000);

          //auth request
          // const response = await request.get('/staff/login');
          // const { user } = response.data;

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authApi.login(username, password);
    // fake accounts
    // setTimeout(() => {
    //   if (username === 'foxmanager@gmail.com' && password === 'zaQ@1234') {
    //     setSession(
    //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Nzc0NTJmZi0wODkzLTRkZTEtOWZjMS05NDQzZWNlYWI1YjAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTWFuYWdlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiZjg5ZDgyYzItNGRmMS00MDhjLWFhNTUtNDE2ZTBkMjVmNmM2IiwiZXhwIjoxNjkzNjY4NjU5LCJpc3MiOiJodHRwczovL3Byb2QuZmluZS1hcGkuc21qbGUudm4vIiwiYXVkIjoiaHR0cHM6Ly9wcm9kLmZpbmUtYXBpLnNtamxlLnZuLyJ9.z8dyLqFTGIIMohRRtTwedxFTJfXFrLt8lv2mpbCBrzM'
    //     );
    //     const user = {
    //       id: '8864c717-587d-472a-929a-8e5f298024da-0',
    //       displayName: 'Fox Manager',
    //       email: 'foxmanager@fine.com',
    //       password: 'demo1234',
    //       photoURL: '/assets/images/mascot_2.png',
    //       phoneNumber: '+84 764420250',
    //       country: 'Viet Nam',
    //       address: 'FPT University HCM',
    //       city: 'HCM City',
    //       about: 'Fox Manager rules the F&B Management',
    //       role: 'admin',
    //       isPublic: true,
    //     };
    //     dispatch({
    //       type: Types.Login,
    //       payload: {
    //         user,
    //       },
    //     });
    //   }
    //   if (username === 'foxstaff@gmail.com' && password === 'zaQ@1234') {
    //     setSession(
    //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Nzc0NTJmZi0wODkzLTRkZTEtOWZjMS05NDQzZWNlYWI1YjAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiU3RhZmYiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImY4OWQ4MmMyLTRkZjEtNDA4Yy1hYTU1LTQxNmUwZDI1ZjZjNiIsImV4cCI6MTY5MzY2ODY1OSwiaXNzIjoiaHR0cHM6Ly9wcm9kLmZpbmUtYXBpLnNtamxlLnZuLyIsImF1ZCI6Imh0dHBzOi8vcHJvZC5maW5lLWFwaS5zbWpsZS52bi8ifQ.W_RYslosZDwm3mOg32Gyb0X3DpZ-F4h0WAxHP_xdSBA'
    //     );

    //     dispatch({
    //       type: Types.Login,
    //       payload: {
    //         user,
    //       },
    //     });
    //   }
    // }, 1000);

    //login request
    if (response.data.status.success) {
      const { accessToken } = response.data.data;
      setSession(accessToken);
      // const user = {
      //   name: name,
      //   roles: roles,
      // };
      const authorizeRes = await staffApi.authorizeStaff();
      const userData = authorizeRes.data;
      const user = {
        id: userData.id,
        displayName: userData.name,
        email: 'foxmanager@fine.com',
        password: 'zaQ@1234',
        photoURL: '/assets/images/mascot_2.png',
        phoneNumber: '+84 764420250',
        country: 'Viet Nam',
        address: 'FPT University HCM',
        city: 'HCM City',
        about: 'Fox Staff runs the F&B Management',
        role: userData.roleType === 1 ? 'admin' : userData.roleType === 2 ? 'staff' : 'driver',
        isPublic: true,
        storeId: userData.storeId,
      };
      dispatch({
        type: Types.Login,
        payload: {
          user,
        },
      });
    }

    return response;
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await request.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: Types.Register,
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: Types.Logout });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
