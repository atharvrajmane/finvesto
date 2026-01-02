import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";

// ==============================
// FETCH HOLDINGS DATA
// ==============================
async function getData() {
  try {
    const res = await apiClient.get("/holdings");

    // ✅ IMPORTANT: actual array is inside res.data.data
    const holdings = res?.data?.data;

    if (!Array.isArray(holdings)) {
      console.error("Holdings data is not an array:", holdings);
      return [];
    }

    return holdings.map((stock) => ({
      label: stock.name,
      value: stock.qty,
    }));
  } catch (error) {
    console.error("Failed to load holdings:", error);
    return [];
  }
}

// ==============================
// CHART CONFIG
// ==============================
const size = {
  width: 800,
  height: 600,
};

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
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

// ==============================
// MAIN COMPONENT
// ==============================
export default function BubbleChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChart() {
      const chartData = await getData();
      setData(chartData);
      setLoading(false);
    }

    loadChart();
  }, []);

  // ==============================
  // LOADING / EMPTY STATES
  // ==============================
  if (loading) {
    return <p className="text-center mt-4">Loading holdings...</p>;
  }

  if (data.length === 0) {
    return <p className="text-center mt-4">No holdings available</p>;
  }

  // ==============================
  // RENDER
  // ==============================
  return (
    <>
      <h3 className="mt-3 mb-4 text-center text-muted">Your Holdings</h3>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear",
        }}
      >
        <div className="container d-flex align-items-center flex-column justify-content-center">
          <PieChart
            series={[
              {
                innerRadius: 255,
                paddingAngle: 3,
                data: data,
              },
            ]}
            {...size}
            legend={{ hidden: true }}
            margin={{ left: 100 }}
          >
            <PieCenterLabel>Holdings</PieCenterLabel>
          </PieChart>
        </div>
      </motion.div>
    </>
  );
}
