import React from "react";
import { motion } from "framer-motion";

const TopTicker = () => {
    const tickerText = "‎* All furniture color customization available here. * All furniture Posish & repairing facilities available. * 3 years foam warranty 5 years mechanical warranty. (Warranty is not available on imported China items) * All furniture color customization available here. * All furniture Posish & repairing facilities available. * 3 years foam warranty 5 years mechanical warranty. (Warranty is not available on imported China items) *";

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-black text-white h-[35px] flex items-center overflow-hidden border-b border-white/10 uppercase tracking-[0.1em] font-medium text-[9px] md:text-[11px]">
            <motion.div
                className="flex whitespace-nowrap gap-8 items-center"
                animate={{
                    x: [0, -1000],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 30,
                        ease: "linear",
                    },
                }}
            >
                <span className="inline-block py-1">{tickerText}</span>
                <span className="inline-block py-1">{tickerText}</span>
            </motion.div>
        </div>
    );
};

export default TopTicker;
