import { render } from '@testing-library/react';
import { makeAddEntryPage } from '@/main/factories/pages/add-entry-page-factory';

describe('makeAddEntryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render AddEntryPage component', () => {
    const component = makeAddEntryPage();

    const { container } = render(component);

    expect(container).toBeInTheDocument();
  });

  it('should create component without props', () => {
    const component = makeAddEntryPage();

    expect(component).toBeDefined();
    expect(component.type.name).toBe('AddEntryPage');
    expect(Object.keys(component.props)).toHaveLength(0);
  });
});
