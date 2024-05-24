import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import DriverAvailabilityForm from "main/components/Driver/DriverAvailabilityForm"
import { driverAvailabilityFixtures } from 'fixtures/driverAvailabilityFixtures';

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("DriverAvailabilityForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Driver Id", "Day", "Start Time", "End Time", "Notes"]; //changed
    const testId = "DriverAvailabilityForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm initialContents={driverAvailabilityFixtures.oneAvailability} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`id`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-driverId`)).toBeInTheDocument();
        expect(screen.getByText(`Driver Id`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-day`)).toBeInTheDocument();
        expect(screen.getByText(`Day`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-startTime`)).toBeInTheDocument();
        expect(screen.getByText(`Start Time`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-endTime`)).toBeInTheDocument();
        expect(screen.getByText(`End Time`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-notes`)).toBeInTheDocument();
        expect(screen.getByText(`Notes`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Driver Id is required./);
        expect(screen.getByText(/Day is required./)).toBeInTheDocument();
        expect(screen.getByText(/Start Time is required./)).toBeInTheDocument();
        expect(screen.getByText(/End Time is required./)).toBeInTheDocument();
    });

    test("validates time format", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );
        
        await screen.findByTestId("DriverAvailabilityForm-driverId");

        const driverIdField = screen.getByTestId("DriverAvailabilityForm-driverId");
        const dayField = screen.getByTestId("DriverAvailabilityForm-day");
         const startInput = screen.getByTestId(`${testId}-startTime`);
        const EndInput = screen.getByTestId(`${testId}-endTime`);
        const notesField = screen.getByTestId("DriverAvailabilityForm-notes");
        const submitButton = screen.getByTestId("DriverAvailabilityForm-submit");

        fireEvent.change(driverIdField, { target: { value: '1' } });
        fireEvent.change(dayField, { target: { value: 'Tuesday' } });

        // Test an invalid start time
        fireEvent.change(startInput, { target: { value: "2567:00AM" } });
        fireEvent.click(screen.getByText(/Create/));
        expect(await screen.findByTestId(`${testId}-startTime`)).toBeInTheDocument();
        expect(screen.getByText(/Please enter time in the format HH:MM AM\/PM (e.g., 3:30PM)./)).toBeInTheDocument();
        fireEvent.change(startInput, { target: { value: "" } }); 

        // Test an invalid end time
        fireEvent.change(EndInput, { target: { value: "12345:65PM" } });
        fireEvent.click(screen.getByText(/Create/));
        expect(await screen.findByTestId(`${testId}-endTime`)).toBeInTheDocument();
        expect(screen.getByText(/Please enter time in the format HH:MM AM\/PM (e.g., 3:30PM)./)).toBeInTheDocument();
        fireEvent.change(startInput, { target: { value: "" } }); 

        // Test another invalid end time format
        fireEvent.change(EndInput, { target: { value: "6543:30AB" } });
        fireEvent.click(screen.getByText(/Create/));
        expect(await screen.findByTestId(`${testId}-endTime`)).toBeInTheDocument();
        expect(screen.getByText(/Please enter time in the format HH:MM AM\/PM (e.g., 3:30PM)./)).toBeInTheDocument();
    });
    
    test("invalidates incorrect time formats from mutations", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm/>
                </Router>
            </QueryClientProvider>
        );
        const startInput = screen.getByTestId(`${testId}-startTime`);
        const EndInput = screen.getByTestId(`${testId}-endTime`);
    
        // Test the mutation that allows any character except those between 0-5 for the first character of the minutes
        fireEvent.change(startInput, { target: { value: "12:X5AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Please enter time in the format HH:MM AM\/PM (e.g., 3:30PM)./, { selector: '#shiftStart + .invalid-feedback' });
        fireEvent.change(startInput, { target: { value: "" } });
    
        // Test the mutation that allows any character except 0-2 after the 1 for hours
        fireEvent.change(EndInput, { target: { value: "1X:59AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Please enter time in the format HH:MM AM\/PM (e.g., 3:30PM)./, { selector: '#shiftEnd + .invalid-feedback' });
        fireEvent.change((`${testId}-endTime`), { target: { value: "" } });
    
        // Test the mutation that allows any character except 0-9 for the second character of the minutes
        fireEvent.change(startInput, { target: { value: "11:5XAM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Please enter time in the format HH:MM AM\/PM (e.g., 3:30PM)./, { selector: '#shiftStart + .invalid-feedback' });
    });

    test("invalidates evem more time formats from mutations", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );
        const startInput = screen.getByTestId(`${testId}-startTime`);
        const EndInput = screen.getByTestId(`${testId}-endTime`);

        // Test for any character except 0-2 after the 1 for hours for shift start
        fireEvent.change(startInput, { target: { value: "1X:00AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Please enter time in the format HH:MM AM\/PM (e.g., 3:30PM)./, { selector: '#shiftStart + .invalid-feedback' });
        fireEvent.change(startInput, { target: { value: "" } });
    
        // Test for any character except 0-5 as the first character for minutes for shift end
        fireEvent.change(EndInput, { target: { value: "12:X0AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Please enter time in the format HH:MM AM\/PM (e.g., 3:30PM)./, { selector: '#shiftEnd + .invalid-feedback' });
        fireEvent.change(EndInput, { target: { value: "" } });
    
        // Test for any character except 0-9 as the second character for minutes for shift start
        fireEvent.change(shiftStartInput, { target: { value: "11:5XAM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Please enter time in the format HH:MM AM\/PM (e.g., 3:30PM)./, { selector: '#shiftStart + .invalid-feedback' });
    });
    
    test("validates time format with more character anomalies for shift end", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );
        const startInput = screen.getByTestId(`${testId}-startTime`);
        const EndInput = screen.getByTestId(`${testId}-endTime`);

        // Test for strings like "0X:00AM" for shift end
        fireEvent.change(EndInput, { target: { value: "0X:00AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Please enter time in the format HH:MM AM\/PM (e.g., 3:30PM)./, { selector: '#shiftEnd + .invalid-feedback' });
        
        // Resetting input
        fireEvent.change(EndInput, { target: { value: "" } });
    });

    test("validates that the minutes part of the time format must have digits", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );
        const startInput = screen.getByTestId(`${testId}-startTime`);
        const EndInput = screen.getByTestId(`${testId}-endTime`);

        // Test for strings like "12:5XAM" for shift end
        fireEvent.change(EndInput, { target: { value: "12:5XAM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Please enter time in the format HH:MM AM\/PM (e.g., 3:30PM)./, { selector: '#shiftEnd + .invalid-feedback' });
    
        // Resetting input
        fireEvent.change(EndInput, { target: { value: "" } });
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();

        render(
            <Router  >
                <DriverAvailabilityForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("DriverAvailabilityForm-driverId");

        const driverIdField = screen.getByTestId("DriverAvailabilityForm-driverId");
        const dayField = screen.getByTestId("DriverAvailabilityForm-day");
        const startTimeField = screen.getByTestId("DriverAvailabilityForm-startTime");
        const endTimeField = screen.getByTestId("DriverAvailabilityForm-endTime");
        const notesField = screen.getByTestId("DriverAvailabilityForm-notes");
        const submitButton = screen.getByTestId("DriverAvailabilityForm-submit");

        fireEvent.change(driverIdField, { target: { value: '1' } });
        fireEvent.change(dayField, { target: { value: 'Tuesday' } });
        fireEvent.change(startTimeField, { target: { value: '11:30AM' } });
        fireEvent.change(endTimeField, { target: { value: '05:30PM' } });
        fireEvent.change(notesField, { target: { value: 'aaa' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Driver Id is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Day is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Start Time is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/End Time is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Notes is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Please enter time in the format HH:MM AM\/PM (e.g., 3:30PM)./)).not.toBeInTheDocument();
    });
    

});