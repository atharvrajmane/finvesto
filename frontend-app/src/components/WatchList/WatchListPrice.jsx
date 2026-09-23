import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function WatchListPrice({ stock }) {
  const price = stock?.price || 0;

  return (
    <div className="stockPercent d-flex align-items-center">
      <div className="text-success" style={{ marginRight: '8px' }}>
        {Number(price).toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR'
        })}
      </div>
      <span className="text-success small ms-1">0.00%</span>
    </div>
  );
}