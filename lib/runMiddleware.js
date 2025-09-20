export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      console.log("======================",req);
      return
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
