import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/presentation/components/ui';

describe('Input', () => {
  it('should render with basic props', () => {
    render(<Input label='Test Label' />);

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should render with all props', () => {
    const handleChange = jest.fn();

    render(
      <Input
        label='Full Test'
        value='test value'
        onChange={handleChange}
        placeholder='Enter text'
        error='This is an error'
        required
        disabled
        type='email'
        className='custom-class'
      />
    );

    const input = screen.getByLabelText('Full Test');
    expect(input).toHaveValue('test value');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
    expect(input).toHaveClass('custom-class');

    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  it('should call onChange when input value changes', () => {
    const handleChange = jest.fn();

    render(<Input label='Test' onChange={handleChange} />);

    const input = screen.getByLabelText('Test');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'new value',
        }),
      })
    );
  });

  it('should render without error when error prop is not provided', () => {
    render(<Input label='No Error' />);

    expect(screen.queryByText('Field is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Invalid input')).not.toBeInTheDocument();
  });

  it('should render with error styling when error is provided', () => {
    render(<Input label='With Error' error='Field is required' />);

    const input = screen.getByLabelText('With Error');
    expect(input).toHaveClass('border-pink-400');
    expect(screen.getByText('Field is required')).toHaveClass('text-pink-600');
  });

  it('should render without error styling when no error', () => {
    render(<Input label='No Error' />);

    const input = screen.getByLabelText('No Error');
    expect(input).toHaveClass('border-slate-300');
    expect(input).not.toHaveClass('border-pink-400');
  });

  it('should render with different input types', () => {
    const { rerender } = render(<Input label='Text Input' type='text' />);
    expect(screen.getByLabelText('Text Input')).toHaveAttribute('type', 'text');

    rerender(<Input label='Email Input' type='email' />);
    expect(screen.getByLabelText('Email Input')).toHaveAttribute(
      'type',
      'email'
    );

    rerender(<Input label='Password Input' type='password' />);
    expect(screen.getByLabelText('Password Input')).toHaveAttribute(
      'type',
      'password'
    );

    rerender(<Input label='Number Input' type='number' />);
    expect(screen.getByLabelText('Number Input')).toHaveAttribute(
      'type',
      'number'
    );

    rerender(<Input label='Date Input' type='date' />);
    expect(screen.getByLabelText('Date Input')).toHaveAttribute('type', 'date');
  });

  it('should pass through additional HTML attributes', () => {
    render(
      <Input
        label='Test'
        step='0.01'
        min='0'
        max='100'
        data-testid='custom-input'
      />
    );

    const input = screen.getByTestId('custom-input');
    expect(input).toHaveAttribute('step', '0.01');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('should handle controlled state', () => {
    render(
      <Input label='Controlled' value='controlled value' onChange={() => {}} />
    );
    const input = screen.getByLabelText('Controlled');
    expect(input).toHaveValue('controlled value');
  });

  it('should handle uncontrolled state', () => {
    render(<Input label='Uncontrolled' />);

    const input = screen.getByLabelText('Uncontrolled');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
  });

  it('should render label with required asterisk when required', () => {
    render(<Input label='Required Field' required />);

    const label = screen.getByText('Required Field');
    expect(label).toBeInTheDocument();

    const input = screen.getByLabelText('Required Field');
    expect(input).toBeRequired();
  });

  it('should combine custom className with default classes', () => {
    render(<Input label='Custom Class' className='my-custom-class' />);

    const input = screen.getByLabelText('Custom Class');
    expect(input).toHaveClass('my-custom-class');
    expect(input).toHaveClass('block', 'w-full', 'rounded-lg'); // default classes
  });

  it('should render helperText when provided and no error', () => {
    render(<Input label='Test Input' helperText='This is helper text' />);

    expect(screen.getByText('This is helper text')).toBeInTheDocument();
    expect(screen.getByText('This is helper text')).toHaveClass(
      'text-slate-500'
    );
  });

  it('should not render helperText when error is present', () => {
    render(
      <Input
        label='Test Input'
        helperText='This is helper text'
        error='This is an error'
      />
    );

    expect(screen.getByText('This is an error')).toBeInTheDocument();
    expect(screen.queryByText('This is helper text')).not.toBeInTheDocument();
  });
});
