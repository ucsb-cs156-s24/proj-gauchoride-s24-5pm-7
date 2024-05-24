import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function DriverAvailabilityForm({ initialContents, submitAction, buttonLabel = "Create" }) {
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all
    const navigate = useNavigate();

    const testIdPrefix = "DriverAvailabilityForm";
    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="driverId">Driver Id</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-driverId"}
                    id="driverId"
                    type="text"
                    isInvalid={Boolean(errors.driverId)}
                    {...register("driverId", {
                        required: "Driver Id is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.driverId?.message}
                </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="day">Day</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-day"}
                    id="day"
                    as="select"
                    isInvalid={Boolean(errors.day)}
                    {...register("day", {
                        required: "Day is required."
                    })}
                >
                     <option value="">Select a day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                    {errors.day?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="startTime">Start Time</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-startTime"}
                    id="startTime"
                    type="text"
                    placeholder="Enter time in the format HH:MM AM/PM e.g. 11:00AM"
                    isInvalid={Boolean(errors.startTime)}
                    {...register("startTime", {
                        required: "Start Time is required.",
                        pattern: {
                            value: /^(0[0-9]|1[0-2]):[0-5][0-9](AM|PM)$/,
                            message: "Please enter time in the format HH:MM AM/PM (e.g., 3:30PM)."
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.startTime?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="endTime">End Time</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-endTime"}
                    id="endTime"
                    type="text"
                    placeholder="Enter time in the format HH:MM AM/PM e.g. 01:37PM"
                    isInvalid={Boolean(errors.endTime)}
                    {...register("endTime", {
                        required: "End Time is required.",
                        pattern: {
                            value: /^(0[0-9]|1[0-2]):[0-5][0-9](AM|PM)$/,
                            message: "Please enter time in the format HH:MM AM/PM (e.g., 3:30PM)."
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.endTime?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="notes">Notes</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-notes"}
                    id="notes"
                    type="text"
                    isInvalid={Boolean(errors.notes)}
                />
            </Form.Group>

            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default DriverAvailabilityForm;