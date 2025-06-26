import { render, screen } from '@testing-library/react';
import { Button } from '@/presentation/components/ui/button';

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('should render with primary variant', () => {
    render(<Button variant='primary'>Primary Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Primary Button');
  });

  it('should render with secondary variant', () => {
    render(<Button variant='secondary'>Secondary Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Secondary Button');
  });

  it('should render with danger variant', () => {
    render(<Button variant='danger'>Danger Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Danger Button');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size='sm'>Small Button</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button size='md'>Medium Button</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button size='lg'>Large Button</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render as disabled', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should render with loading state', () => {
    render(<Button isLoading>Loading Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Carregando...');
  });

  it('should render with custom className', () => {
    render(<Button className='custom-class'>Custom Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should render with different types', () => {
    const { rerender } = render(<Button type='submit'>Submit Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<Button type='button'>Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');

    rerender(<Button type='reset'>Reset Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('should handle disabled and loading states', () => {
    const { rerender } = render(
      <Button disabled isLoading>
        Disabled Loading
      </Button>
    );

    let button = screen.getByRole('button');
    expect(button).toBeDisabled();

    rerender(
      <Button disabled={false} isLoading>
        Just Loading
      </Button>
    );
    button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Carregando...');

    rerender(
      <Button disabled isLoading={false}>
        Just Disabled
      </Button>
    );
    button = screen.getByRole('button');
    expect(button).toBeDisabled();

    rerender(
      <Button disabled={false} isLoading={false}>
        Neither
      </Button>
    );
    button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should show loading spinner when isLoading is true', () => {
    render(<Button isLoading>Loading Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Carregando...');

    // Check for the presence of the SVG spinner
    const spinner = button.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });

  it('should show children when not loading', () => {
    render(<Button isLoading={false}>Normal Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Normal Button');
    expect(button.querySelector('svg')).not.toBeInTheDocument();
  });
});
