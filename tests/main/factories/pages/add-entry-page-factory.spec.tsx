import { render } from '@testing-library/react';
import { makeAddEntryPage } from '@/main/factories/pages/add-entry-page-factory';

// Mock the AddEntryPage component
jest.mock('@/presentation/components/server/add-entry-page', () => ({
  AddEntryPage: () => (
    <div data-testid='add-entry-page'>
      <div data-testid='component-rendered'>true</div>
    </div>
  ),
}));

describe('makeAddEntryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render AddEntryPage component', () => {
    const component = makeAddEntryPage();

    const { getByTestId } = render(component);

    expect(getByTestId('add-entry-page')).toBeInTheDocument();
    expect(getByTestId('component-rendered')).toHaveTextContent('true');
  });

  it('should create component without props', () => {
    const component = makeAddEntryPage();

    expect(component).toBeDefined();
    expect(component.type.name).toBe('AddEntryPage');
    expect(Object.keys(component.props)).toHaveLength(0);
  });
});
