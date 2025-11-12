import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { motion } from "framer-motion";
// 1. CHANGED: Import our authenticated apiClient instead of the default axios
import apiClient from '../../api/apiClient'; // <-- MAKE SURE THIS PATH IS CORRECT
import { useEffect, useState } from 'react';

// This function now uses the imported apiClient
async function getData() {
    // 2. CHANGED: Use apiClient and the shorter URL
    let holdingsData = await apiClient.get("/holdings");
    holdingsData = holdingsData.data;
    let data = []
    for (let stock of holdingsData) {
        let newStock = {
            label: stock.name,
            value: stock.qty
        }
        data.push(newStock);
    }
    return data;
}

const size = {
    width: 800,
    height: 600,
};

const StyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
}));

function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
        <StyledText x={left + width / 2} y={top + height / 2}>
            {children}
        </StyledText>
    );
}

export default function BubbleChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getData().then((data) => {
            setData(data);
        })
    // 3. CRITICAL BUG FIX: Added [] to prevent an infinite loop of API calls.
    // Without this, the component would make non-stop requests to your server.
    }, [])

    console.log(data);

    return (
        <>
            <h3 className='mt-3 mb-4 text-center text-muted'>Your Holdings</h3>
            <motion.div
                animate={{
                    rotate: 360,
                }}
                transition={{
                    repeat: Infinity,
                    duration: 10,
                    ease: "linear",
                }}
            >
                <div className="container d-flex align-items-center flex-column justify-content-center">
                    <PieChart series={[{ innerRadius: 255, paddingAngle: 3, data, }]} {...size} legend={{ hidden: true }} margin={{ left: 100 }}>
                            
                    </PieChart>
                </div>
            </motion.div>
        </>
    );
}