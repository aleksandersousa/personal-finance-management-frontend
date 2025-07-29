import { render, screen, fireEvent } from '@testing-library/react';
import { Chart, ChartDataPoint } from '@/presentation/components/ui';

describe('Chart Component', () => {
  const mockData: ChartDataPoint[] = [
    {
      label: 'Jan 2024',
      value: 100000, // R$ 1000.00
      date: new Date('2024-01-01'),
      metadata: { confidence: 'HIGH' },
    },
    {
      label: 'Feb 2024',
      value: 150000, // R$ 1500.00
      date: new Date('2024-02-01'),
      metadata: { confidence: 'MEDIUM' },
    },
    {
      label: 'Mar 2024',
      value: 200000, // R$ 2000.00
      date: new Date('2024-03-01'),
      metadata: { confidence: 'LOW' },
    },
  ];

  it('should render chart with title', () => {
    render(<Chart data={mockData} title='Test Chart' />);

    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('should render chart without title when not provided', () => {
    render(<Chart data={mockData} />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('should render SVG with correct dimensions', () => {
    const { container } = render(<Chart data={mockData} height={400} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '800');
    expect(svg).toHaveAttribute('height', '400');
  });

  it('should render data points as circles', () => {
    const { container } = render(<Chart data={mockData} />);

    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(3); // One for each data point
  });

  it('should render x-axis labels', () => {
    const { container } = render(<Chart data={mockData} />);

    const texts = container.querySelectorAll('text');
    const labelTexts = Array.from(texts).map(text => text.textContent);

    expect(labelTexts).toContain('Jan 2024');
    expect(labelTexts).toContain('Feb 2024');
    expect(labelTexts).toContain('Mar 2024');
  });

  it('should call onPointHover when hovering over a point', () => {
    const mockOnPointHover = jest.fn();
    const { container } = render(
      <Chart data={mockData} onPointHover={mockOnPointHover} />
    );

    const firstCircle = container.querySelector('circle');
    if (firstCircle) {
      fireEvent.mouseEnter(firstCircle);
      expect(mockOnPointHover).toHaveBeenCalledWith(mockData[0]);
    }
  });

  it('should call onPointClick when clicking a point', () => {
    const mockOnPointClick = jest.fn();
    const { container } = render(
      <Chart data={mockData} onPointClick={mockOnPointClick} />
    );

    const firstCircle = container.querySelector('circle');
    if (firstCircle) {
      fireEvent.click(firstCircle);
      expect(mockOnPointClick).toHaveBeenCalledWith(mockData[0]);
    }
  });

  it('should format values using default currency formatter', () => {
    const { container } = render(<Chart data={mockData} />);

    const texts = container.querySelectorAll('text');
    const textValues = Array.from(texts).map(text => text.textContent);

    // Should contain formatted currency values
    expect(textValues.some(text => text?.includes('R$'))).toBe(true);
  });

  it('should use custom formatValue function when provided', () => {
    const customFormatter = (value: number) => `${value} cents`;
    const { container } = render(
      <Chart data={mockData} formatValue={customFormatter} />
    );

    const texts = container.querySelectorAll('text');
    const textValues = Array.from(texts).map(text => text.textContent);

    expect(textValues.some(text => text?.includes('cents'))).toBe(true);
  });

  it('should handle empty data gracefully', () => {
    const { container } = render(<Chart data={[]} />);

    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(0);
  });

  it('should apply custom color when provided', () => {
    const customColor = '#FF5733';
    const { container } = render(<Chart data={mockData} color={customColor} />);

    const circles = container.querySelectorAll('circle');
    const firstCircle = circles[0];

    expect(firstCircle).toHaveAttribute('fill', customColor);
  });

  it('should render zero line when data contains negative values', () => {
    const dataWithNegative: ChartDataPoint[] = [
      ...mockData,
      {
        label: 'Apr 2024',
        value: -50000, // Negative value
        date: new Date('2024-04-01'),
      },
    ];

    const { container } = render(<Chart data={dataWithNegative} />);

    const lines = container.querySelectorAll('line');
    const dashedLine = Array.from(lines).find(
      line => line.getAttribute('stroke-dasharray') === '5,5'
    );

    expect(dashedLine).toBeInTheDocument();
  });
});
