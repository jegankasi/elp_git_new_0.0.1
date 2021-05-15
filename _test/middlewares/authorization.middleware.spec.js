const authoriazation = require("../../src/middlewares/authorization.middleware");
const tlUser = require("../../src/services/tl_user.services");
const jwt = require('jsonwebtoken');
const helper = require('./helper/profile');

describe('Get all users request', () => {

    test('Unauthorized if not set Bearer', async () => {
        let req = { headers: { activerole: "ADMIN" } };
        let res = {};
        res.status = (status) => { res.status = status; return res; };
        res.send = (ob) => { res.send = ob; return res; };
        let next = () => { };
        await authoriazation.authorize_token(req, res, next);
        const expectedReponse = { "status": 401, "send": { "status": "error", "data": "Unauthorized!" } }
        expect(res).toEqual(expectedReponse);
    });

    test('Unauthorized if not set activerole', async () => {
        let req = {
            headers: {
                authorization: "Bearer test123"
            }
        };
        let res = {};
        res.status = (status) => { res.status = status; return res; };
        res.send = (ob) => { res.send = ob; return res; };
        let next = () => { };
        await authoriazation.authorize_token(req, res, next);
        const expectedReponse = {
            status: 401,
            send: { status: 'error', data: 'please mentioned activerole in header!' }
        }
        expect(res).toEqual(expectedReponse);
    });


    test('POST method is called', async () => {
        const jwtSpy = jest.spyOn(jwt, 'verify');
        jwtSpy.mockReturnValue({ userId: 90 });
        const tlProfile = jest.spyOn(tlUser, 'getProfile');
        tlProfile.mockReturnValue(helper.profile);
        let req = {
            headers: {
                authorization: "Bearer test123",
                activerole: "ADMIN"
            },
            app: {
                get: () => { }
            },
            originalUrl: "/v1/agency/tl_profile_function/",
            method: 'POST'
        };
        let res = {};
        res.status = (status) => { res.status = status; return res; };
        res.send = (ob) => { res.send = ob; return res; };
        let next = jest.fn()
        await authoriazation.authorize_token(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test('PATH param url is called', async () => {
        const jwtSpy = jest.spyOn(jwt, 'verify');
        jwtSpy.mockReturnValue({ userId: 90 });
        const tlProfile = jest.spyOn(tlUser, 'getProfile');
        tlProfile.mockReturnValue(helper.profile);
        let req = {
            headers: {
                authorization: "Bearer test123",
                activerole: "ADMIN"
            },
            app: {
                get: () => { }
            },
            originalUrl: "/v1/agency/tl_profile_function/id/123",
            method: 'GET'
        };
        let res = {};
        res.status = (status) => { res.status = status; return res; };
        res.send = (ob) => { res.send = ob; return res; };
        let next = jest.fn()
        await authoriazation.authorize_token(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});