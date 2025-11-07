import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table';

describe('Table', () => {
  describe('rendering', () => {
    it('should render complete table with all sections', () => {
      render(
        <Table>
          <TableCaption>Test Caption</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Header 1</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Cell 1</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Footer 1</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(screen.getByText('Test Caption')).toBeInTheDocument();
      expect(screen.getByText('Header 1')).toBeInTheDocument();
      expect(screen.getByText('Cell 1')).toBeInTheDocument();
      expect(screen.getByText('Footer 1')).toBeInTheDocument();
    });

    it('should render table without optional sections', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Only Body</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText('Only Body')).toBeInTheDocument();
    });

    it('should render multiple rows', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Row 1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText('Row 1')).toBeInTheDocument();
      expect(screen.getByText('Row 2')).toBeInTheDocument();
      expect(screen.getByText('Row 3')).toBeInTheDocument();
    });

    it('should render multiple columns', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Col 1</TableCell>
              <TableCell>Col 2</TableCell>
              <TableCell>Col 3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText('Col 1')).toBeInTheDocument();
      expect(screen.getByText('Col 2')).toBeInTheDocument();
      expect(screen.getByText('Col 3')).toBeInTheDocument();
    });
  });

  describe('data attributes', () => {
    it('should have correct data-slot attributes', () => {
      const { container } = render(
        <Table>
          <TableCaption>Caption</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Head</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(container.querySelector('[data-slot="table-container"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="table"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="table-caption"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="table-header"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="table-body"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="table-footer"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="table-row"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="table-head"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="table-cell"]')).toBeInTheDocument();
    });

    it('should support data-state attribute on TableRow', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow data-state="selected">
              <TableCell>Selected</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const row = container.querySelector('[data-state="selected"]');
      expect(row).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply custom className to Table', () => {
      const { container } = render(
        <Table className="custom-table">
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const table = container.querySelector('[data-slot="table"]');
      expect(table).toHaveClass('custom-table');
    });

    it('should apply custom className to TableHeader', () => {
      const { container } = render(
        <Table>
          <TableHeader className="custom-header">
            <TableRow>
              <TableHead>Head</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const header = container.querySelector('[data-slot="table-header"]');
      expect(header).toHaveClass('custom-header');
    });

    it('should apply custom className to TableBody', () => {
      const { container } = render(
        <Table>
          <TableBody className="custom-body">
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const body = container.querySelector('[data-slot="table-body"]');
      expect(body).toHaveClass('custom-body');
    });

    it('should apply custom className to TableFooter', () => {
      const { container } = render(
        <Table>
          <TableFooter className="custom-footer">
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      const footer = container.querySelector('[data-slot="table-footer"]');
      expect(footer).toHaveClass('custom-footer');
    });

    it('should apply custom className to TableRow', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow className="custom-row">
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const row = container.querySelector('[data-slot="table-row"]');
      expect(row).toHaveClass('custom-row');
    });

    it('should apply custom className to TableHead', () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="custom-head">Head</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const head = container.querySelector('[data-slot="table-head"]');
      expect(head).toHaveClass('custom-head');
    });

    it('should apply custom className to TableCell', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="custom-cell">Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const cell = container.querySelector('[data-slot="table-cell"]');
      expect(cell).toHaveClass('custom-cell');
    });

    it('should apply custom className to TableCaption', () => {
      const { container } = render(
        <Table>
          <TableCaption className="custom-caption">Caption</TableCaption>
        </Table>
      );

      const caption = container.querySelector('[data-slot="table-caption"]');
      expect(caption).toHaveClass('custom-caption');
    });
  });

  describe('semantic HTML', () => {
    it('should use semantic table elements', () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Body</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(container.querySelector('table')).toBeInTheDocument();
      expect(container.querySelector('thead')).toBeInTheDocument();
      expect(container.querySelector('tbody')).toBeInTheDocument();
      expect(container.querySelector('tfoot')).toBeInTheDocument();
      expect(container.querySelector('tr')).toBeInTheDocument();
      expect(container.querySelector('th')).toBeInTheDocument();
      expect(container.querySelector('td')).toBeInTheDocument();
    });

    it('should use caption element', () => {
      const { container } = render(
        <Table>
          <TableCaption>Test Caption</TableCaption>
        </Table>
      );

      expect(container.querySelector('caption')).toBeInTheDocument();
    });
  });

  describe('colSpan support', () => {
    it('should support colSpan on TableCell', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3}>Spanning 3 columns</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const cell = screen.getByText('Spanning 3 columns');
      expect(cell).toHaveAttribute('colSpan', '3');
    });

    it('should support colSpan in footer', () => {
      render(
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell>$100</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      const totalCell = screen.getByText('Total');
      expect(totalCell).toHaveAttribute('colSpan', '2');
    });
  });

  describe('accessibility', () => {
    it('should support aria attributes via props spread', () => {
      render(
        <Table aria-label="User data table">
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByLabelText('User data table')).toBeInTheDocument();
    });

    it('should support role attribute on checkboxes', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <input type="checkbox" role="checkbox" aria-label="Select row" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should render empty table', () => {
      const { container } = render(<Table />);

      const table = container.querySelector('[data-slot="table"]');
      expect(table).toBeInTheDocument();
    });

    it('should render table with only header', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Only Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      expect(screen.getByText('Only Header')).toBeInTheDocument();
    });

    it('should render table with nested elements in cells', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <div data-testid="nested">
                  <span>Nested</span>
                  <button>Button</button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByTestId('nested')).toBeInTheDocument();
      expect(screen.getByText('Nested')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
