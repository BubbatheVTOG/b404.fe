export const validateEmail = email => {
  if (!email) {
    return 
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    return 'Invalid email address';
  }
};


export const required = input => {
  if (!input) {
    return 'Required';
  }
}

export const validatePassword = password => {
  if (!password) {
    return 'Required';
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(password)) {
    return 'Password must contain at least eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
  }
}