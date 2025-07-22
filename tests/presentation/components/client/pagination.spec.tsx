import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/presentation/components/ui';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render pagination buttons correctly', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should highlight current page', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const currentPageButton = screen.getByText('2');
    expect(currentPageButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('should not highlight other pages', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const otherPageButton = screen.getByText('1');
    expect(otherPageButton).toHaveClass('bg-gray-200');
    expect(otherPageButton).not.toHaveClass('bg-blue-600');
  });

  it('should call onPageChange with correct page when page is clicked', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const pageButton = screen.getByText('2');
    fireEvent.click(pageButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should disable current page button', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const currentPageButton = screen.getByText('2');
    expect(currentPageButton).toBeDisabled();
  });

  it('should not disable other page buttons', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const otherPageButton = screen.getByText('1');
    expect(otherPageButton).not.toBeDisabled();
  });

  it('should render single page without pagination when totalPages is 1', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('should render multiple pages correctly', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should not call onPageChange when current page is clicked', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const currentPageButton = screen.getByText('2');
    fireEvent.click(currentPageButton);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });
});
