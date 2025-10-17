import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import { CustomDropdown, type Option } from "../CustomDropdown";

const mockOptions: Option[] = [
    { id: "1", value: "professional", name: "Professional" },
    { id: "2", value: "friendly", name: "Friendly" },
    { id: "3", value: "formal", name: "Formal" },
    { id: "4", value: "creative", name: "Creative" },
];

const defaultProps = {
    label: "Tone",
    options: mockOptions,
    value: "",
    onChange: vi.fn(),
};

describe("CustomDropdown", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render with empty value when nothing is selected", async () => {
        // setup
        const label = "Tone";

        // execute
        const { container } = render(
            <CustomDropdown
                label={label}
                options={[]}
                value=""
                onChange={vi.fn()}
            />
        );

        // assert
        const selectElement = container.querySelector('[role="combobox"]');
        expect(selectElement).not.toBeNull();
        expect(selectElement).toHaveAttribute('aria-expanded', 'false');
    });



    it("should display selected option name", async () => {
        // setup
        const selectedValue = "professional";

        // execute
        render(<CustomDropdown {...defaultProps} value={selectedValue} />);

        // assert
        await waitFor(() => expect(screen.getByText("Professional")).not.toBeNull());
    });

    it("should call onChange when option is selected", async () => {
        // setup
        const mockOnChange = vi.fn();
        const { container } = render(
            <CustomDropdown {...defaultProps} onChange={mockOnChange} />
        );

        // execute
        const selectElement = container.querySelector('[role="combobox"]') as HTMLElement;
        fireEvent.mouseDown(selectElement);

        await waitFor(() => {
            const option = screen.getByText("Friendly");
            fireEvent.click(option);
        });

        // assert
        expect(mockOnChange).toHaveBeenCalled();
    });

    it("should render all options when dropdown is opened", async () => {
        // setup
        const { container } = render(<CustomDropdown {...defaultProps} />);

        // execute
        const selectElement = container.querySelector('[role="combobox"]') as HTMLElement;
        fireEvent.mouseDown(selectElement);

        // assert
        await waitFor(() => {
            expect(screen.getByText("Professional")).toBeInTheDocument();
            expect(screen.getByText("Friendly")).toBeInTheDocument();
            expect(screen.getByText("Formal")).toBeInTheDocument();
            expect(screen.getByText("Creative")).toBeInTheDocument();
        });
    });




    it("should display helper text when provided", async () => {
        // setup
        const helperText = "Please select an option";

        // execute
        render(<CustomDropdown {...defaultProps} helperText={helperText} />);

        // assert
        await waitFor(() => expect(screen.getByText(helperText)).not.toBeNull());
    });


    it("should handle empty options array", async () => {
        // setup
        const { container } = render(
            <CustomDropdown
                {...defaultProps}
                options={[]}
            />
        );

        // assert
        const selectElement = container.querySelector('[role="combobox"]');
        expect(selectElement).not.toBeNull();
        expect(selectElement).toHaveAttribute('aria-expanded', 'false');
    });

    it("should be disabled when disabled prop is true", async () => {
        // setup
        const { container } = render(<CustomDropdown {...defaultProps} disabled={true} />);

        // execute
        const selectElement = container.querySelector('[role="combobox"]') as HTMLElement;

        // assert
        expect(selectElement).toHaveAttribute("aria-disabled", "true");
    });

    it("should show error state when error prop is true", async () => {
        // setup
        const { container } = render(<CustomDropdown {...defaultProps} error={true} />);

        // execute
        const inputElement = container.querySelector('.MuiOutlinedInput-root');

        // assert
        expect(inputElement).toHaveClass("Mui-error");
    });

    it("should apply custom className", async () => {
        // setup
        const customClass = "custom-dropdown-class";

        // execute
        const { container } = render(
            <CustomDropdown {...defaultProps} className={customClass} />
        );

        // assert
        expect(container.querySelector(`.${customClass}`)).not.toBeNull();
    });

    it("should open dropdown when clicked", async () => {
        // setup
        const { container } = render(<CustomDropdown {...defaultProps} />);

        // execute
        const selectElement = container.querySelector('[role="combobox"]') as HTMLElement;
        fireEvent.mouseDown(selectElement);

        // assert
        await waitFor(() => {
            expect(selectElement).toHaveAttribute('aria-expanded', 'true');
        });
    });
});
