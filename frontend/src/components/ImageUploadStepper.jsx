import * as React from 'react';
import { useRef, useState } from 'react';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Skeleton from "@mui/material/Skeleton";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlipIcon from '@mui/icons-material/Flip';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const circularCropperStyles = `
  .cropper-view-box,
  .cropper-face {
    border-radius: 50%;
  }
`;

const steps = ['Choose an image', 'Crop & Edit', 'Upload image'];

export default function ImageUploadStepper({ handleFileUpload }) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [previewUrl, setPreviewUrl] = React.useState(null);
    const [croppedImage, setCroppedImage] = React.useState(null);
    const fileInputRef = React.useRef(null);
    const cropperRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);

    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const handleFileSelect = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        if (files.length === 0) {
            return alert("Please select a file.");
        }
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result);
            setSelectedImage(files[0]);
            handleNext();
        };
        reader.readAsDataURL(files[0]);
    };

    const getCroppedFile = (croppedDataUrl) => {
        setCroppedImage(croppedDataUrl);
        handleNext();
    };

    const rotate = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        cropper.rotate(90);
    };

    const flip = (type) => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        if (type === "h") {
            cropper.scaleX(scaleX === 1 ? -1 : 1);
            setScaleX(scaleX === 1 ? -1 : 1);
        } else {
            cropper.scaleY(scaleY === 1 ? -1 : 1);
            setScaleY(scaleY === 1 ? -1 : 1);
        }
    };

    const handleCrop = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        const img = cropper.getCroppedCanvas().toDataURL();
        getCroppedFile(img);
    };

    const handleUpload = async () => {
        if (croppedImage && handleFileUpload) {
            try {
                const croppedFile = dataURLtoFile(
                    croppedImage,
                    selectedImage.name || 'cropped-image.jpg'
                );

                const mockEvent = {
                    preventDefault: () => { },
                    target: {
                        files: [croppedFile]
                    }
                };

                await handleFileUpload(mockEvent);
                handleNext();
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                        >
                            Choose Image
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                ref={fileInputRef}
                            />
                        </Button>
                    </Box>
                );

            case 1:
                return (
                    <Box sx={{ p: 3 }}>
                        {loading && (
                            <Skeleton variant="rectangular" width="100%" height={400} />
                        )}
                        <Box display="flex" justifyContent="flex-end" mb={1}>
                            <ButtonGroup disableElevation variant="contained">
                                <Button onClick={rotate} startIcon={<Rotate90DegreesCwIcon />} />
                                <Button onClick={() => flip("h")} startIcon={<FlipIcon />} />
                                <Button onClick={() => flip("v")} startIcon={<FlipIcon sx={{ transform: 'rotate(90deg)' }} />} />
                            </ButtonGroup>
                        </Box>
                        <style>{circularCropperStyles}</style>

                        <Cropper
                            src={previewUrl}
                            style={{ height: 300, width: "80%" }}
                            aspectRatio={1}
                            guides={false}
                            ready={() => {
                                setLoading(false);
                            }}
                            ref={cropperRef}
                            zoomable={false}
                            center={true}
                            minCropBoxHeight={150}
                            minCropBoxWidth={150}
                        />
                        <Button
                            sx={{ float: "right", mt: 1 }}
                            onClick={handleCrop}
                            variant="contained"
                        >
                            Next
                        </Button>
                    </Box>
                );

            case 2:
                return (
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                        {croppedImage && (
                            <Box sx={{ mb: 2 }}>
                                <img
                                    src={croppedImage}
                                    alt="Cropped preview"
                                    style={{ maxWidth: '100%', maxHeight: 300 }}
                                />
                            </Box>
                        )}
                        <Button
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            onClick={handleUpload}
                        >
                            Save Image
                        </Button>
                    </Box>
                );

            default:
                return (
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 2
                        }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 48 }} />
                        </Box>
                        <Typography variant="h6" gutterBottom>
                            Upload Complete!
                        </Typography>
                    </Box>
                );
        }
    };

    return (
        <Paper sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {renderStepContent()}

            {activeStep < steps.length && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                        variant="outlined"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    {activeStep < steps.length - 1 && activeStep !== 1 && (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={!selectedImage}
                        >
                            Next
                        </Button>
                    )}
                </Box>
            )}
        </Paper>
    );
}