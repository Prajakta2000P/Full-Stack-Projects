package com.second.librarypro.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.second.librarypro.Entity.IssueRecord;



public interface IssueRecordRepository extends JpaRepository<IssueRecord,Long> {
	
	

}
