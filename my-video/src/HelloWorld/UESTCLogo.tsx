import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Img,
	staticFile
} from 'remotion';

const FONT_FAMILY = 'Arial, Helvetica, sans-serif';
const PRIMARY_COLOR = '#004098'; // UESTC Blue

const titleStyle: React.CSSProperties = {
	fontFamily: FONT_FAMILY,
	fontWeight: 'bold',
	fontSize: 60,
	textAlign: 'center',
	position: 'absolute',
	bottom: 150,
	width: '100%',
	color: PRIMARY_COLOR,
};

const subtitleStyle: React.CSSProperties = {
	fontFamily: FONT_FAMILY,
	fontSize: 30,
	textAlign: 'center',
	position: 'absolute',
	bottom: 280,
	width: '100%',
	color: '#555',
};

export const UESTCLogo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// 1. Logo Animation (Move Up)
	// Animate from 0 to 1 after 25 frames
	const logoTranslationProgress = spring({
		frame: frame - 25,
		fps,
		config: {
			damping: 100,
		},
	});

	// Move the logo up by 100 pixels once the transition starts
	const logoTranslation = interpolate(
		logoTranslationProgress,
		[0, 1],
		[0, -100],
	);

	// Initial logo entrance spring
	const entranceSpring = spring({
		frame,
		fps,
		config: {
			damping: 15,
			stiffness: 120,
			mass: 0.8,
		}
	});

	// Use spring for scale (0 -> 1)
	const logoScale = interpolate(entranceSpring, [0, 1], [0, 1]);

	// Add rotation (-180 -> 0 degrees) for a spin-in effect
	const logoRotation = interpolate(entranceSpring, [0, 1], [-180, 0]);

	// Simple fade in
	const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{backgroundColor: 'white'}}>
			<AbsoluteFill>
				
				{/* Logo Container */}
				<AbsoluteFill style={{
					justifyContent: 'center',
					alignItems: 'center',
					transform: `translateY(${logoTranslation}px)`,
				}}>
					<div style={{
						opacity: logoOpacity,
						transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
					}}>
						<Img 
							src={staticFile('uestc-logo.png')} 
							style={{
								width: '550px', // Slightly smaller to fit text
								height: 'auto',
							}}
						/>
					</div>
				</AbsoluteFill>

				{/* Title Sequence (Chinese) */}
				<Sequence from={60}>
					<h1 style={{
						...titleStyle,
						opacity: interpolate(frame - 60, [0, 20], [0, 1]),
					}}>
						电子科技大学
					</h1>
				</Sequence>

				{/* Subtitle Sequence (English) */}
				<Sequence from={35}>
					<div style={{
						...subtitleStyle,
						opacity: interpolate(frame - 35, [0, 20], [0, 1]),
					}}>
						University of Electronic Science and Technology of China
					</div>
				</Sequence>

			</AbsoluteFill>
		</AbsoluteFill>
	);
};
