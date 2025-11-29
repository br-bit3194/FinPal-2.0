// "use client";
// import React from "react";
// import { motion } from "framer-motion";
// import { cn } from "../lib/utils";

// export const BoxesCore = ({
//   className,
//   ...rest
// }) => {
//   const rows = new Array(150).fill(1);
//   const cols = new Array(100).fill(1);
// let colors = [
//     "#0081A7", // Your primary blue
//     "#00B4D8", // Lighter blue
//     "#90E0EF", // Very light blue
//     "#CAF0F8", // Pale blue
//     "#E8F4FD", // Almost white blue
//     "#F0F9FF", // Sky blue tint
//     "#E0F2FE", // Light cyan
//     "#BFDBFE", // Light blue
//     "#93C5FD", // Medium light blue
//   ];
//   const getRandomColor = () => {
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   return (
//     <div
//       style={{
//         transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
//       }}
//       className={cn(
//         "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
//         className
//       )}
//       {...rest}>
//       {rows.map((_, i) => (
//         <motion.div key={`row` + i} className="relative h-8 w-16 border-l border-gray-300">
//           {cols.map((_, j) => (
//             <motion.div
//               whileHover={{
//                 backgroundColor: `${getRandomColor()}`,
//                 transition: { duration: 0 },
//               }}
//               animate={{
//                 transition: { duration: 2 },
//               }}
//               key={`col` + j}
//               className="relative h-8 w-16 border-t border-r border-gray-300">
//               {j % 2 === 0 && i % 2 === 0 ? (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-[#0081A7]">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
//                 </svg>
//               ) : null}
//             </motion.div>
//           ))}
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export const Boxes = React.memo(BoxesCore);


import React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

// Financial icons SVGs
const icons = [
  // Line chart
  (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28" stroke="#1A237E" strokeWidth="1.5"><polyline points="3,17 9,11 13,15 21,7" /><circle cx="3" cy="17" r="1.5" fill="#FFD700" /><circle cx="9" cy="11" r="1.5" fill="#FFD700" /><circle cx="13" cy="15" r="1.5" fill="#FFD700" /><circle cx="21" cy="7" r="1.5" fill="#FFD700" /></svg>
  ),
  // Dollar sign
  (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28" stroke="#388E3C" strokeWidth="1.5"><path d="M12 3v18M8 7c0-2 8-2 8 0s-8 2-8 4 8 2 8 4-8 2-8 0" /><circle cx="12" cy="12" r="10.5" stroke="#B0BEC5" strokeWidth="1" /></svg>
  ),
  // Upward arrow
  (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28" stroke="#1976D2" strokeWidth="1.5"><path d="M12 19V5M12 5l-6 6M12 5l6 6" /></svg>
  ),
  // Pie chart
  (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28" stroke="#F9A825" strokeWidth="1.5"><path d="M12 2a10 10 0 1 0 10 10h-10z" /><path d="M12 2v10h10" /></svg>
  ),
];

const palette = [
  "#F5F7FA", // light background
  "#E3E6ED", // soft gray
  "#1A237E", // navy
  "#FFD700", // gold
  "#388E3C", // green
];

export const BoxesCore = ({ className, ...rest }) => {
  // Fewer rows/cols for performance and clarity
  const rows = new Array(10).fill(1);
  const cols = new Array(16).fill(1);
  const getIcon = (i, j) => icons[(i + j) % icons.length];
  const getBg = (i, j) => palette[(i * 3 + j * 2) % palette.length];

  return (
    <div
      style={{
        pointerEvents: "none",
        zIndex: 0,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
      className={cn("background-finpal", className)}
      {...rest}
    >
      {/* Soft gradient overlay for depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "linear-gradient(120deg, rgba(245,247,250,0.95) 60%, rgba(26,35,126,0.08) 100%)",
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${rows.length}, 1fr)`,
          gridTemplateColumns: `repeat(${cols.length}, 1fr)`,
          width: "100vw",
          height: "100vh",
          position: "relative",
          zIndex: 0,
        }}
      >
        {rows.map((_, i) =>
          cols.map((_, j) => (
            <motion.div
              key={`cell-${i}-${j}`}
              initial={{ opacity: 0.7, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.08, boxShadow: "0 4px 24px 0 rgba(26,35,126,0.08)" }}
              transition={{ duration: 0.8, delay: (i * cols.length + j) * 0.01 }}
              style={{
                background: getBg(i, j),
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 48,
                minWidth: 48,
                margin: 2,
                border: "1px solid #E3E6ED",
                boxShadow: "0 1px 4px 0 rgba(26,35,126,0.03)",
                position: "relative",
                zIndex: 0,
              }}
            >
              {getIcon(i, j)}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);