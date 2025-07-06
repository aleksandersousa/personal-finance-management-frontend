import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '@/presentation/components/ui';

describe('Select', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('should render with basic props', () => {
    render(<Select label='Test Select' options={options} />);

    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
    expect(screen.getByText('Test Select')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(<Select label='Test Select' options={options} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should render with placeholder', () => {
    render(
      <Select
        label='Test Select'
        options={options}
        placeholder='Choose an option'
      />
    );

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('should render with selected value', () => {
    render(
      <Select
        label='Test Select'
        options={options}
        value='option2'
        onChange={() => {}}
      />
    );

    const select = screen.getByLabelText('Test Select') as HTMLSelectElement;
    expect(select.value).toBe('option2');
  });

  it('should call onChange when selection changes', () => {
    const handleChange = jest.fn();

    render(
      <Select label='Test Select' options={options} onChange={handleChange} />
    );

    const select = screen.getByLabelText('Test Select');
    fireEvent.change(select, { target: { value: 'option2' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should render with error', () => {
    render(
      <Select
        label='Test Select'
        options={options}
        error='Selection is required'
      />
    );

    expect(screen.getByText('Selection is required')).toBeInTheDocument();
  });

  it('should render as required', () => {
    render(<Select label='Test Select' options={options} required />);

    const select = screen.getByLabelText('Test Select');
    expect(select).toBeRequired();
  });

  it('should render as disabled', () => {
    render(<Select label='Test Select' options={options} disabled />);

    const select = screen.getByLabelText('Test Select');
    expect(select).toBeDisabled();
  });

  it('should render with custom className', () => {
    render(
      <Select label='Test Select' options={options} className='custom-class' />
    );

    const select = screen.getByLabelText('Test Select');
    expect(select).toHaveClass('custom-class');
  });

  it('should handle empty options array', () => {
    render(<Select label='Empty Select' options={[]} />);

    const select = screen.getByLabelText('Empty Select');
    expect(select).toBeInTheDocument();
  });

  it('should render placeholder option with empty value and disabled', () => {
    render(
      <Select label='Test Select' options={options} placeholder='Choose...' />
    );

    const select = screen.getByLabelText('Test Select');
    const placeholderOption = select.querySelector('option[value=""]');

    expect(placeholderOption).toBeInTheDocument();
    expect(placeholderOption).toHaveTextContent('Choose...');
    expect(placeholderOption).toBeDisabled();
  });

  it('should render helperText when provided and no error', () => {
    render(
      <Select
        label='Test Select'
        options={options}
        helperText='This is helper text'
      />
    );

    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  it('should not render helperText when error is present', () => {
    render(
      <Select
        label='Test Select'
        options={options}
        helperText='This is helper text'
        error='This is an error'
      />
    );

    expect(screen.getByText('This is an error')).toBeInTheDocument();
    expect(screen.queryByText('This is helper text')).not.toBeInTheDocument();
  });

  it('should generate unique id when not provided', () => {
    const { container } = render(
      <Select label='Test Select' options={options} />
    );

    const select = container.querySelector('select');
    const label = container.querySelector('label');

    expect(select).toHaveAttribute('id');
    expect(label).toHaveAttribute(
      'for',
      select?.getAttribute('id') || undefined
    );
  });

  it('should use provided id', () => {
    render(<Select label='Test Select' options={options} id='custom-id' />);

    const select = screen.getByLabelText('Test Select');
    expect(select).toHaveAttribute('id', 'custom-id');
  });
});
