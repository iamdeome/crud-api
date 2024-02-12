/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 920:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const uuid_1 = __webpack_require__(104);
let users = [
    {
        id: (0, uuid_1.v4)(),
        username: 'john_doe',
        age: 30,
        hobbies: ['reading', 'swimming']
    },
    {
        id: (0, uuid_1.v4)(),
        username: 'jane_smith',
        age: 25,
        hobbies: ['painting', 'hiking']
    }
];
function createUser(user) {
    users.push(user);
    return user;
}
exports.createUser = createUser;
function getUsers() {
    return users;
}
exports.getUsers = getUsers;
function getUserById(id) {
    return users.find(user => user.id === id);
}
exports.getUserById = getUserById;
function updateUser(id, newData) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        users[userIndex] = Object.assign(Object.assign({}, users[userIndex]), newData);
        return users[userIndex];
    }
    return undefined;
}
exports.updateUser = updateUser;
function deleteUser(id) {
    const initialLength = users.length;
    users = users.filter(user => user.id !== id);
    return users.length !== initialLength;
}
exports.deleteUser = deleteUser;


/***/ }),

/***/ 740:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __importStar(__webpack_require__(136));
const url = __importStar(__webpack_require__(716));
const data = __importStar(__webpack_require__(920));
const uuid_1 = __webpack_require__(104);
const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url || '', true);
    const { pathname } = reqUrl;
    //handle GET to see all users
    if (pathname === '/api/users' && req.method === 'GET') {
        const users = data.getUsers();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
        //handle GET request to open the user by ID
    }
    else if ((pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/api/users/')) && req.method === 'GET') {
        const userId = pathname.split('/')[3];
        const user = data.getUserById(userId);
        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('User not found');
        }
    } // Handle POST request for creating a new user
    else if (pathname === '/api/users' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const user = JSON.parse(body);
                // Check if required fields are present in the request body
                if (!user.username || !user.age || !user.hobbies) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Required fields missing: username, age, and hobbies');
                    return;
                }
                const userID = (0, uuid_1.v4)();
                // Create the new user if all required fields are present
                const newUser = Object.assign(Object.assign({}, user), { id: userID });
                data.createUser(newUser);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newUser));
            }
            catch (error) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON');
            }
        });
    }
    // Handle PUT request for updating a specific user by ID
    else if ((pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/api/users/')) && req.method === 'PUT') {
        const userId = pathname.split('/')[3];
        if (!(0, uuid_1.validate)(userId)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid userId');
            return;
        }
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newData = JSON.parse(body);
                const updatedUser = data.updateUser(userId, newData);
                if (updatedUser) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(updatedUser));
                }
                else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('User not found');
                }
            }
            catch (error) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON');
            }
        });
    } // Handle PUT request for updating a specific user by ID
    else if ((pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/api/users/')) && req.method === 'DELETE') {
        const userId = pathname.split('/')[3];
        if (!(0, uuid_1.validate)(userId)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid userId');
            return;
        }
        const success = data.deleteUser(userId);
        if (success) {
            res.writeHead(204);
            res.end();
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('User not found');
        }
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found. in human human-friendly message');
    }
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


/***/ }),

/***/ 104:
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ 136:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 716:
/***/ ((module) => {

module.exports = require("url");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(740);
/******/ 	
/******/ })()
;