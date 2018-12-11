<?php

            function post_filter($post_variable){
                $post_variable =isset($post_variable)?$post_variable:null;
                if(isset($post_variable)){
                $post_variable =	filter_input(INPUT_POST,$post_variable, FILTER_SANITIZE_SPECIAL_CHARS);
                }
                return $post_variable;
                
            }  
            function get_filter($get_variable){
                $get_variable =isset($get_variable)?$get_variable:null;
                if(isset($get_variable)){
                $get_variable = filter_input(INPUT_GET,$get_variable,  FILTER_SANITIZE_SPECIAL_CHARS);
                }
                return $get_variable;
                
            } 


?>