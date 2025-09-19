// // Logger utility to handle console logs based on environment
// // This prevents logs from appearing in production

// const isDevelopment = process.env.NODE_ENV === 'development';

// const logger = {
//   log: (...args) => {
//     if (isDevelopment) {
//       console.log(...args);
//     }
//   },
  
//   info: (...args) => {
//     if (isDevelopment) {
//       console.info(...args);
//     }
//   },
  
//   warn: (...args) => {
//     if (isDevelopment) {
//       console.warn(...args);
//     }
//   },
  
//   error: (...args) => {
//     // Keep error logs in all environments for critical issues
//     // You can also make this conditional if you want to hide all logs
//     console.error(...args);
//   },
  
//   debug: (...args) => {
//     if (isDevelopment) {
//       console.debug(...args);
//     }
//   },
  
//   // Add this method if you want to force a log in any environment
//   // Useful for critical information that should always be logged
//   always: (...args) => {
//     console.log(...args);
//   }
// };

// export default logger; 