// lib/auth.js

const users = [
    { login: "admin", password: "admin123", role: "shtab" },
    { login: "operator", password: "operator123", role: "operator" },
    { login: "tashkilot", password: "tashkilot123", role: "tashkilot" },
  ];
  
  export const authenticate = (login, password) => {
    return users.find(
      (user) => user.login === login && user.password === password
    );
  };
  