import React, { useEffect, useRef, useState } from "react";

import { CheckCircle, Login, Logout, KeyboardArrowRight } from "@mui/icons-material";
import IntroVideoMap from "../assets/remittix/intro_video_map.png"

import "react-sweet-progress/lib/style.css";

function PresaleChild1() {
    return (
        <>
            <div className="mint_child1_container_separator">
                <svg width="100%" height="3" viewBox="0 0 1270 3" fill="none" xmlns="http://www.w3.org/2000/svg"><line y1="1.97125" x2="1270" y2="1.97125" stroke="url(#paint0_linear_1541_128)" stroke-opacity="0.24" stroke-width="2.05751"></line><line x1="131.233" y1="1.97125" x2="512.233" y2="1.97125" stroke="url(#paint1_linear_1541_128)" stroke-opacity="0.68" stroke-width="2.05751"></line><defs><linearGradient id="paint0_linear_1541_128" x1="0" y1="3.5" x2="1270" y2="3.5" gradientUnits="userSpaceOnUse"><stop stop-color="#F9FF38" stop-opacity="0"></stop><stop offset="0.178272" stop-color="#F9FF38"></stop><stop offset="1" stop-color="#F9FF38" stop-opacity="0"></stop></linearGradient><linearGradient id="paint1_linear_1541_128" x1="131.233" y1="3.5" x2="512.233" y2="3.5" gradientUnits="userSpaceOnUse"><stop stop-color="#F9FF38" stop-opacity="0"></stop><stop offset="0.178272" stop-color="#F9FF38"></stop><stop offset="1" stop-color="#F9FF38" stop-opacity="0"></stop></linearGradient></defs></svg>
            </div>
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
