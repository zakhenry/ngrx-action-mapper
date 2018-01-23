import { ActionMapper } from './action-mapper';

describe('ActionMapper', () => {

  it('should be able to register an action against a payload reducer function, and return the mapper', () => {

    const mapper = new ActionMapper();

    const action = {type: 'dummy-action'};
    const reducerFunction = jasmine.createSpy('actionMapper');

    expect(mapper.add(action, reducerFunction)).toBe(mapper);
  });

});
