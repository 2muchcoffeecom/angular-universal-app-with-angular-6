import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const purchases = [
      { name: 'Bread', completed: false },
      { name: 'Milk', completed: false },
    ];
    return { purchases };
  }
}
