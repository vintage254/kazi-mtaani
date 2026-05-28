import { FunctionComponent } from 'react';
import styles from './SignInScreens.module.css';


const SignInScreens: FunctionComponent = () => {
   return (
      <div className={styles.signInScreens}>
         <div className={styles.signInParent}>
            <b className={styles.signIn}>Sign in</b>
            <div className={styles.manatalShortlistingLlm}>Manatal Shortlisting LLM</div>
            <div className={styles.microsoftLogin}>
               <img className={styles.icons8Microsoft1} alt="" />
               <div className={styles.signInWith}>Sign in with Microsoft</div>
               <img className={styles.icons8Right1} alt="" />
            </div>
            <div className={styles.rectangleParent}>
               <div className={styles.frameChild} />
               <div className={styles.signInWith}>Or with email</div>
               <div className={styles.frameChild} />
            </div>
            <div className={styles.emailParent}>
               <div className={styles.email}>Email</div>
               <div className={styles.basicInputs}>
                  <div className={styles.examplemailcom}>Example@mail.com</div>
               </div>
            </div>
            <div className={styles.emailParent}>
               <div className={styles.email}>Password</div>
               <div className={styles.basicInputs}>
                  <div className={styles.show}>
                     <div className={styles.text}>********</div>
                     <div className={styles.microsoftLogin2}>
                        <div className={styles.icons}>
                           <img className={styles.securityIcon} alt="" />
                        </div>
                     </div>
                  </div>
               </div>
               <div className={styles.clearButton}>
                  <div className={styles.clear}>Forgot Password</div>
               </div>
            </div>
            <div className={styles.myButtons}>
               <div className={styles.email}>Sign in</div>
            </div>
            <div className={styles.text2}>
               <div className={styles.dontHaveAn}>Don&apos;t have an account?</div>
                  <div className={styles.clearButton2}>
                     <div className={styles.clear2}>Sign Up</div>
                  </div>
                  </div>
                  </div>
                  </div>);
               };

export default SignInScreens;
