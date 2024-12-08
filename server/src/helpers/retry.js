// Retry function
import retry from "async-retry";
import { response } from "express";

// Retry logic function
async function fetchWithRetry(fn) {
  return retry(
    async () => {
      try {
        const result = await fn(); // Call the function passed as an argument
        return result;
      } catch (error) {
        response.send(error); 
      }
    },
    {
      retries: 3, // Number of retries
      minTimeout: 1000, // Minimum timeout between retries (1 second)
      maxTimeout: 5000, // Maximum timeout between retries (5 seconds)
    }
  );
}

export { fetchWithRetry };
