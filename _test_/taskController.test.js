const { getTasks, setTask, updateTask } = require('../controller/taskController');
const Task = require('../models/taskModel');
const  User = require('../models/userModel');
jest.mock('../models/taskModel');
jest.mock('../models/userModel');

beforeEach(() => {
    jest.clearAllMocks(); // Resets the state of all mocks
});

test('should get tasks for a user', async () => {
    const req = { user: { id: 'user-id' }};
    //Mocking tasks for the user
    const tasks = [
        { _id: 'task-id-1', text: 'Task 1', user: 'user-id' },
        { _id: 'task-id-2', text: 'Task 2', user: 'user-id' },
    ];
    //Mocking the find method to return tasks for the user
    Task.find.mockResolvedValue(tasks);

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    await getTasks(req, res);
    //Ensure that the response contain the expected tasks 
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tasks);
});

test('should set a new task for a user', async () => {
    const req = { user: {id: 'user-id'}, body: { text: 'New Task'} }

    //Mocking the created task
    const task = { _id: 'new-task-id', text: 'New Task', user: 'user-id' };
    
    //Mocking the create method to return the new task
    Task.create.mockResolvedValue(task);

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await setTask(req, res);

    //Ensure that the response contains the new Task 
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(task);
});

test('should return a 400 error for missing task text', async () => {

  const req = { user: { id: 'user-id'}, body: {} };

    const res = {
        status: jest.fn().mockReturnThis(), // Chainable
        json: jest.fn(),
    };
    
    await setTask(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Please enter a task' });
    
});

test('should return a 402 error if user not found', async () => {
    const taskId = 'task-id-1';
    const userId = 'non-existent-user-id';
    const req = { params: { id: taskId}, user: { id: userId }, body: { text: 'Updated Task' }};

    const taskToUpdate = { _id: taskId, text: 'Original Task', user: 'user-id' };

    Task.findById.mockResolvedValue(taskToUpdate);

    User.findById.mockResolvedValue(null);

    const res = { 
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await expect(updateTask(req, res)).rejects.toThrow('No such user found');
    expect(res.status).toHaveBeenCalledWith(401);

});

test('should return a 402 error if the user is not authorized to update the task', async () => {
    const taskId = 'task-id-1';
    const userId = 'user-id-2';
    const req = { params: { id: taskId }, user: { id:userId }, body: { text: 'Updateed Task' } };

    const taskToUpdate = { _id: taskId, text: 'Original Task', user: 'user-id-1' };

    Task.findById.mockResolvedValue(taskToUpdate);

    User.findById.mockResolvedValue({ _id: userId });

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await expect(updateTask(req, res)).rejects.toThrow('User is not authorized to update');
    expect(res.status).toHaveBeenCalledWith(401);
});