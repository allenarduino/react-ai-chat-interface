import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import OptionsPanel from "../OptionsPanel";
import type { ChatOptions } from "../../types/chat";

const mockOptions: ChatOptions = {
    tone: 'professional',
    responseLength: 'medium',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    includeContext: true,
    maxAttachments: 5,
    maxAttachmentSize: 10 * 1024 * 1024,
};

const defaultProps = {
    options: mockOptions,
    onOptionsChange: vi.fn(),
    onClose: vi.fn(),
    isOpen: true,

};

describe("OptionsPanel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });





    it("should display current options values", () => {
        // setup
        render(<OptionsPanel {...defaultProps} />);

        // assert
        expect(screen.getByDisplayValue("professional")).toBeInTheDocument();
        expect(screen.getByDisplayValue("gpt-4")).toBeInTheDocument();
        expect(screen.getByText("Medium")).toBeInTheDocument();
    });


    it("should call onOptionsChange when tone is changed", async () => {
        // setup
        const mockOnOptionsChange = vi.fn();
        const { container } = render(
            <OptionsPanel
                {...defaultProps}
                onOptionsChange={mockOnOptionsChange}
            />
        );

        // execute
        const toneSelect = container.querySelector('[role="combobox"]') as HTMLElement;
        fireEvent.mouseDown(toneSelect);

        await waitFor(() => {
            const friendlyOption = screen.getByText("Friendly");
            fireEvent.click(friendlyOption);
        });

        // assert
        expect(mockOnOptionsChange).toHaveBeenCalledWith({
            ...mockOptions,
            tone: 'friendly'
        });
    });

    it("should call onOptionsChange when model is changed", async () => {
        // setup
        const mockOnOptionsChange = vi.fn();
        const { container } = render(
            <OptionsPanel
                {...defaultProps}
                onOptionsChange={mockOnOptionsChange}
            />
        );

        // execute
        const modelSelects = container.querySelectorAll('[role="combobox"]');
        const modelSelect = modelSelects[1] as HTMLElement; // Second dropdown is model
        fireEvent.mouseDown(modelSelect);

        await waitFor(() => {
            const gpt35Option = screen.getByText("GPT-3.5 Turbo");
            fireEvent.click(gpt35Option);
        });

        // assert
        expect(mockOnOptionsChange).toHaveBeenCalledWith({
            ...mockOptions,
            model: 'gpt-3.5-turbo'
        });
    });

    it("should call onOptionsChange when response length slider is changed", () => {
        // setup
        const mockOnOptionsChange = vi.fn();
        const { container } = render(
            <OptionsPanel
                {...defaultProps}
                onOptionsChange={mockOnOptionsChange}
            />
        );

        // execute
        const slider = container.querySelector('[role="slider"]') as HTMLElement;
        fireEvent.mouseDown(slider, { clientX: 100 }); // Simulate dragging to short position

        // assert
        expect(mockOnOptionsChange).toHaveBeenCalled();
    });


    it("should display correct response length value", () => {
        // setup
        const shortOptions = { ...mockOptions, responseLength: 'short' as const };
        render(
            <OptionsPanel
                {...defaultProps}
                options={shortOptions}
            />
        );

        // assert
        expect(screen.getByText("Short")).toBeInTheDocument();
    });

    it("should display long response length value", () => {
        // setup
        const longOptions = { ...mockOptions, responseLength: 'long' as const };
        render(
            <OptionsPanel
                {...defaultProps}
                options={longOptions}
            />
        );

        // assert
        expect(screen.getByText("Long")).toBeInTheDocument();
    });


    it("should render slider with correct marks", () => {
        // setup
        render(<OptionsPanel {...defaultProps} />);

        // assert
        expect(screen.getByText("Short")).toBeInTheDocument();
        expect(screen.getByText("Medium")).toBeInTheDocument();
        expect(screen.getByText("Long")).toBeInTheDocument();
    });

    it("should handle multiple rapid option changes", async () => {
        // setup
        const mockOnOptionsChange = vi.fn();
        const { container } = render(
            <OptionsPanel
                {...defaultProps}
                onOptionsChange={mockOnOptionsChange}
            />
        );

        // execute - change tone
        const toneSelect = container.querySelector('[role="combobox"]') as HTMLElement;
        fireEvent.mouseDown(toneSelect);

        await waitFor(() => {
            const friendlyOption = screen.getByText("Friendly");
            fireEvent.click(friendlyOption);
        });

        // execute - change model
        const modelSelects = container.querySelectorAll('[role="combobox"]');
        const modelSelect = modelSelects[1] as HTMLElement;
        fireEvent.mouseDown(modelSelect);

        await waitFor(() => {
            const claudeOption = screen.getByText("Claude 3.5 Sonnet");
            fireEvent.click(claudeOption);
        });

        // assert
        expect(mockOnOptionsChange).toHaveBeenCalledTimes(2);
        expect(mockOnOptionsChange).toHaveBeenNthCalledWith(1, {
            ...mockOptions,
            tone: 'friendly'
        });
        expect(mockOnOptionsChange).toHaveBeenNthCalledWith(2, {
            ...mockOptions,
            model: 'claude-3.5-sonnet'
        });
    });
});
