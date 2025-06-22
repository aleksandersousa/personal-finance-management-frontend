import { makeRemoteAddEntry } from '@/main/factories/usecases/add-entry-factory';
import { RemoteAddEntry } from '@/data/usecases/remote-add-entry';

jest.mock('@/data/usecases/remote-add-entry');

describe('AddEntryFactory', () => {
  it('should make RemoteAddEntry with correct dependencies', () => {
    makeRemoteAddEntry();

    expect(RemoteAddEntry).toHaveBeenCalledWith(
      'http://localhost:3001/api/entries',
      expect.any(Object)
    );
  });
});
