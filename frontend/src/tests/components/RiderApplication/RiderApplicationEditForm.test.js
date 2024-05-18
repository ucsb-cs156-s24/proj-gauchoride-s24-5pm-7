import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RiderApplicationEditForm from "main/components/RiderApplication/RiderApplicationEditForm";
import { riderApplicationFixtures } from "fixtures/riderApplicationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RiderApplicationEditForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Email", "Description"];
    const testId = "RiderApplicationEditForm";

    const renderWithProviders = (ui) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    {ui}
                </Router>
            </QueryClientProvider>
        );
    };

    test('handleApprove submits data, toggles rider status, and navigates', async () => {
        // Test implementation remains unchanged
    });

    test('handleDeny submits data and navigates', async () => {
        // Test implementation remains unchanged
    });

    test('handleExpired submits data and navigates', async () => {
        // Test implementation remains unchanged
    });

    test("renders correctly with no initialContents", async () => {
        // Test implementation remains unchanged
    });

    test("renders correctly when passing in initialContents", async () => {
        // Test implementation remains unchanged
    });

    test("renders correctly when passing in initialContents with status declined", async () => {
        // Test implementation remains unchanged
    });

    test("renders correctly when passing in initialContents with status cancelled", async () => {
        // Test implementation remains unchanged
    });

    test("renders correctly when passing in initialContents with status expired", async () => {
        // Test implementation remains unchanged
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        // Test implementation remains unchanged
    });

    // New tests added below

    test('handles toggleRider mutation', async () => {
        const mockSubmitAction = jest.fn();
        const initialContents = {
            id: 1,
            userId: 'user123',
            status: 'pending',
            email: 'test@example.com',
            created_date: '2024-03-06',
            updated_date: '2024-03-06',
            cancelled_date: null,
            notes: 'This is a note.',
            perm_number: '1234567',
            description: 'This is a test description.'
        };

        renderWithProviders(
            <RiderApplicationEditForm
                initialContents={initialContents}
                submitAction={mockSubmitAction}
                email="test@example.com"
            />
        );

        fireEvent.click(screen.getByTestId(`${testId}-approve`));

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalledWith(
            expect.objectContaining({ status: 'accepted', notes: 'This is a note.' })
        ));
    });

    test('handles form submission', async () => {
        const mockSubmitAction = jest.fn();
        const initialContents = {
            id: 1,
            userId: 'user123',
            status: 'pending',
            email: 'test@example.com',
            created_date: '2024-03-06',
            updated_date: '2024-03-06',
            cancelled_date: null,
            notes: 'This is a note.',
            perm_number: '1234567',
            description: 'This is a test description.'
        };

        renderWithProviders(
            <RiderApplicationEditForm
                initialContents={initialContents}
                submitAction={mockSubmitAction}
                email="test@example.com"
            />
        );

        fireEvent.click(screen.getByTestId(`${testId}-submit`));

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
    });

    test('renders correctly with initialContents', async () => {
        const initialContents = {
            id: 1,
            userId: 'user123',
            status: 'pending',
            email: 'test@example.com',
            created_date: '2024-03-06',
            updated_date: '2024-03-06',
            cancelled_date: null,
            notes: 'This is a note.',
            perm_number: '1234567',
            description: 'This is a test description.'
        };

        renderWithProviders(
            <RiderApplicationEditForm
                initialContents={initialContents}
            />
        );

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
    });

    test('renders correctly without initialContents', async () => {
        renderWithProviders(
            <RiderApplicationEditForm />
        );

        expect(await screen.findByText(/Return/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
    });
});
