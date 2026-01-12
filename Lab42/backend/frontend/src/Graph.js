import React, { useRef, useEffect, useState } from 'react';

const Graph = ({ r, points, onChartClick }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null); // Реф для родительского контейнера
    const [size, setSize] = useState(400); // Состояние для размера стороны квадрата

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const newSize = entry.contentRect.width;
                if (newSize > 0) setSize(newSize);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = size;
        const h = size;
        const centerX = w / 2;
        const centerY = h / 2;

        const step = w / 12;

        ctx.clearRect(0, 0, w, h);

        if (r > 0) {
            ctx.fillStyle = 'rgba(0, 123, 255, 0.5)';

            ctx.fillRect(centerX - (r / 2) * step, centerY - r * step, (r / 2) * step, r * step);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + r * step, centerY);
            ctx.lineTo(centerX, centerY - (r / 2) * step);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, (r / 2) * step, 0, Math.PI / 2, false);
            ctx.fill();
        }

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY); ctx.lineTo(w, centerY);
        ctx.moveTo(centerX, 0); ctx.lineTo(centerX, h);
        ctx.stroke();

        points.forEach(p => {
            ctx.fillStyle = p.hit ? '#22c55e' : '#ef4444';
            ctx.beginPath();
            ctx.arc(centerX + p.x * step, centerY - p.y * step, w / 150, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    useEffect(() => {
        draw();
    }, [r, points, size]);

    const handleClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const xPx = e.clientX - rect.left;
        const yPx = e.clientY - rect.top;

        const step = size / 12;
        const x = (xPx - size / 2) / step;
        const y = (size / 2 - yPx) / step;

        onChartClick(x.toFixed(2), y.toFixed(2));
    };

    return (
        <div ref={containerRef} style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
            <canvas
                ref={canvasRef}
                width={size}
                height={size}
                onClick={handleClick}
                style={{
                    display: 'block',
                    cursor: 'crosshair',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
            />
        </div>
    );
};

export default Graph;