import { render, screen, fireEvent } from '@testing-library/react';
import { PaginationWrapper } from '@/presentation/components/client/pagination-wrapper';

// Mock do Next.js router
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams('page=1&other=value');

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

describe('PaginationWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render pagination with correct props', () => {
    render(<PaginationWrapper currentPage={1} totalPages={3} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should call router.push with correct params when page is clicked', () => {
    render(<PaginationWrapper currentPage={1} totalPages={3} />);

    const pageButton = screen.getByText('2');
    fireEvent.click(pageButton);

    expect(mockPush).toHaveBeenCalledWith('?page=2&other=value');
  });

  it('should preserve existing search params when changing page', () => {
    render(<PaginationWrapper currentPage={1} totalPages={3} />);

    const pageButton = screen.getByText('3');
    fireEvent.click(pageButton);

    expect(mockPush).toHaveBeenCalledWith('?page=3&other=value');
  });

  it('should handle page 1 correctly', () => {
    render(<PaginationWrapper currentPage={2} totalPages={3} />);

    const pageButton = screen.getByText('1');
    fireEvent.click(pageButton);

    expect(mockPush).toHaveBeenCalledWith('?page=1&other=value');
  });

  it('should not call router.push when current page is clicked', () => {
    render(<PaginationWrapper currentPage={2} totalPages={3} />);

    const currentPageButton = screen.getByText('2');
    fireEvent.click(currentPageButton);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should work with single page', () => {
    render(<PaginationWrapper currentPage={1} totalPages={1} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('should work with multiple pages', () => {
    render(<PaginationWrapper currentPage={1} totalPages={5} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
