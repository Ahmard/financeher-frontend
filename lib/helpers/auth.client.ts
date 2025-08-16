'use client';

import {useMessage} from "@/lib/hooks/message";
import {UserRegistrationStage} from "@/lib/models/user";
import {useEffect} from "react";
import {redirect} from "next/navigation";

export const useHandleUncompletedRegistration = (user: AuthUserData) => {
    const {showMessage} = useMessage()

    useEffect(() => {
        switch (user.registration_stage) {
            case UserRegistrationStage.PlanSubscription:
                showMessage('Please complete your registration by selecting your plan', 'warning');
                setTimeout(() => redirect('/account-setup/plan-payment'), 200);
                break;
            case UserRegistrationStage.EmailVerification:
                showMessage('Please complete your registration by verifying your email', 'warning');
                setTimeout(() => redirect('/login'), 200);
                break;
            case UserRegistrationStage.AccountSetup:
                showMessage('Please complete your registration by completing setup form', 'warning');
                setTimeout(() => redirect('/account-setup/finalise'), 200);
                break;
        }
    }, []);
}