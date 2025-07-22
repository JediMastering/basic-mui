
const login = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        resolve({ token: "fake-jwt-token" });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};

export const authService = {
  login,
};
