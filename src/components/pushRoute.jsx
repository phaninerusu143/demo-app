// import { useRef } from 'react';
import {  useParams, useLocation,useNavigate } from 'react-router-dom';

export function pushRoute(Component) {
 const state={};
  return (props) => (
    <Component
      {...props}
      value={state}
      location={useLocation()}
      params={useParams(props)}
      navigate={useNavigate()}
    />
  );
}
