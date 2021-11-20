import tabwrap from '../src/index';

describe('tabwrap', () : void => {
    it('can be called', () : void => {
        const element = document.createElement('div');

        tabwrap(element);
    });
});
