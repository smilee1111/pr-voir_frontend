// const request = require("supertest");
// const app = require("../server"); // Ensure your Express app is exported from `server.js`
// const User = require("../model/user");

// // Mocking Sequelize Model
// jest.mock("../model/user");

// describe("User Routes", () => {
//     let mockUser;

//     beforeEach(() => {
//         mockUser = {
//             id: 1,
//             username: "testuser",
//             email: "test@example.com",
//             password: "$2b$10$hashedpassword", // Mocked hashed password
//             phonenumber: "1234567890"
//         };
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     test("POST /register - should register a user", async () => {
//         User.findOne.mockResolvedValue(null);
//         User.create.mockResolvedValue(mockUser);

//         const response = await request(app)
//             .post("/api/register")
//             .send({
//                 username: "testuser",
//                 email: "test@example.com",
//                 password: "password123",
//                 phonenumber: "1234567890"
//             });

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty("message", "Registration Successful");
//         expect(response.body).toHaveProperty("token");
//     });

//     test("POST /login - should log in a user", async () => {
//         User.findOne.mockResolvedValue(mockUser);

//         const response = await request(app)
//             .post("/api/login")
//             .send({
//                 email: "test@example.com",
//                 password: "password123"
//             });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("message", "Login Successful");
//         expect(response.body).toHaveProperty("token");
//     });

//     test("GET /GetUsers - should fetch all users", async () => {
//         User.findAll.mockResolvedValue([mockUser]);

//         const response = await request(app).get("/api/GetUsers");

//         expect(response.status).toBe(200);
//         expect(response.body.length).toBeGreaterThan(0);
//     });

//     test("PUT /UpdateUsers/:id - should update user data", async () => {
//         User.findByPk.mockResolvedValue(mockUser);
//         mockUser.update = jest.fn().mockResolvedValue(mockUser);

//         const response = await request(app)
//             .put("/api/UpdateUsers/1")
//             .send({ username: "updatedUser" });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("message", "User updated successfully");
//     });

//     test("DELETE /DeleteUsers/:id - should delete a user", async () => {
//         User.findByPk.mockResolvedValue(mockUser);
//         mockUser.destroy = jest.fn().mockResolvedValue();

//         const response = await request(app).delete("/api/DeleteUsers/1");

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("message", "User deleted successfully");
//     });

//     test("POST /register - should fail if email is already registered", async () => {
//         User.findOne.mockResolvedValue(mockUser);

//         const response = await request(app)
//             .post("/api/register")
//             .send({
//                 username: "testuser",
//                 email: "test@example.com",
//                 password: "password123",
//                 phonenumber: "1234567890"
//             });

//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty("error", "Email already registered");
//     });

//     test("POST /login - should fail if password is incorrect", async () => {
//         User.findOne.mockResolvedValue(mockUser);

//         const response = await request(app)
//             .post("/api/login")
//             .send({
//                 email: "test@example.com",
//                 password: "wrongpassword"
//             });

//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty("error", "Incorrect password");
//     });
// });
