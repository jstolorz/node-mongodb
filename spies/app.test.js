const expect = require('expect');
const rewire = require('rewire');

let app = rewire('./app');




describe('App spy', ()=>{

    let db = {
      saveUser: expect.createSpy()
    };

    app.__set__('db',db);


    it('schould call the spy correctly',()=>{
        let spy = expect.createSpy();
        spy('Janusz',49);
        expect(spy).toHaveBeenCalledWith('Janusz',49);
    });

    it('schould call saveUser with user object.',()=>{
       let email = 'jstolorz@gmail.com';
       let password = '12345gfdsf';

       app.handleSignUp(email,password);
       expect(db.saveUser).toHaveBeenCalledWith({email, password});
    });



});