interface Result {
  result: string;
}

export function getData(): Promise<Result> {
  return new Promise((resolve) => {
    return resolve({ result: `result` });
  });
}

export function getOneData(id: string): Promise<Result> {
  return new Promise((resolve) => {
    return resolve({ result: `result One User ${id}` });
  });
}

export const UsersServices = { getData, getOneData };
