import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import Styles from "./CustomSelect.module.scss"
import { IoChevronDown } from "react-icons/io5";

const cx = classNames.bind(Styles);

const CustomSelect = ({ options, onChange, placeHolder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const selectRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onChange(option);
    };

    const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
    <div className={cx("custom-select-wrapper")} ref={selectRef}>
            <div className={cx("custom-select-trigger")} onClick={toggleDropdown}>
                {selectedOption ? selectedOption.label : placeHolder}
            </div>
                <IoChevronDown className={cx("down-icon")} onClick={toggleDropdown}/>
            {isOpen && (
                <div className={cx("custom-options")}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={cx("custom-option")}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
