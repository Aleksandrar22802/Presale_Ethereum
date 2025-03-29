import React, { useEffect, useRef, useState } from "react";

import { CheckCircle, Login, Logout, KeyboardArrowRight } from "@mui/icons-material";
import IntroVideoMap from "../assets/remittix/intro_video_map.png"

import "react-sweet-progress/lib/style.css";

function PresaleChild1() {
    return (
        <>
            <div className="mint_child1_container">
                <div className="mint_child1_pane">
                    <div className="mint_child1_pane_wrapper">
                        <img 
                            src={IntroVideoMap}
                        />
                    </div>
                </div>
                <div className="mint_child1_dsc">
                    <div className="line_desc_1">
                        <p>Why Remittix?</p>
                    </div>
                    <div className="line_desc_2">
                        <p>Bridging crypto with local</p>
                    </div>
                    <div className="line_desc_3">
                        <p>payment networks globally.</p>
                    </div>
                    <div className="line_desc_4">
                        <p>Remittix empowers crypto holders and businesses to facilitate crypto-to-fiat transactions worldwide, leveraging local payment networks and blockchain technology.</p>
                    </div>
                    <div className="line_desc_5">
                        <p>At last, enjoy the speed of crypto with the everyday convenience of fiat payments.</p>
                    </div>
                    <div className="line_desc_6">
                        <a className="link_white_paper" target="_blank" href="https://remittix-organization.gitbook.io/remittix">
                            <span className="text-center">Whitepaper</span>
                            <KeyboardArrowRight color="white" />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PresaleChild1;
